<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\PayOrderRequest;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->with([
            'table',
            'user:id,name,username,role',
            'items.menuItem.category',
        ]);

        $statuses = [];
        if ($request->filled('status')) {
            $statuses = array_values(array_filter(array_map(
                'trim',
                explode(',', (string) $request->query('status'))
            )));

            $invalid = array_diff($statuses, Order::STATUSES);
            if ($invalid !== []) {
                throw ValidationException::withMessages([
                    'status' => ['Invalid status filter: '.implode(', ', $invalid)],
                ]);
            }

            $query->whereIn('status', $statuses);
        }

        // Kitchen and active service queues are FIFO (oldest first); full/paid history is newest first.
        $isActiveQueue = $statuses !== [] && ! in_array(Order::STATUS_PAID, $statuses, true);
        $query->orderBy('created_at', $isActiveQueue ? 'asc' : 'desc')
            ->orderBy('id', $isActiveQueue ? 'asc' : 'desc');

        return response()->json($query->get());
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $order = DB::transaction(function () use ($validated, $user): Order {
            /** @var Table $table */
            $table = Table::query()->lockForUpdate()->findOrFail($validated['table_id']);

            if ($table->status !== Table::STATUS_AVAILABLE) {
                throw ValidationException::withMessages([
                    'table_id' => ["Table {$table->table_number} is currently occupied and cannot start a new order."],
                ]);
            }

            $menuItemIds = collect($validated['items'])
                ->pluck('menu_item_id')
                ->unique()
                ->values();

            $menuItems = MenuItem::query()
                ->whereIn('id', $menuItemIds)
                ->get()
                ->keyBy('id');

            $soldOutNames = [];
            $totalCents = 0;

            foreach ($validated['items'] as $line) {
                /** @var MenuItem $menuItem */
                $menuItem = $menuItems->get($line['menu_item_id']);

                if (! $menuItem->is_available) {
                    $soldOutNames[] = $menuItem->name;

                    continue;
                }

                $unitCents = (int) round(((float) $menuItem->price) * 100);
                $totalCents += $unitCents * (int) $line['quantity'];
            }

            if ($soldOutNames !== []) {
                $uniqueSoldOut = implode(', ', array_unique($soldOutNames));
                throw ValidationException::withMessages([
                    'items' => ["Cannot order sold out item(s): {$uniqueSoldOut}."],
                ]);
            }

            $order = Order::query()->create([
                'table_id' => $table->id,
                'user_id' => $user->id,
                'status' => Order::STATUS_PENDING,
                'total' => number_format($totalCents / 100, 2, '.', ''),
            ]);

            foreach ($validated['items'] as $line) {
                $order->items()->create([
                    'menu_item_id' => $line['menu_item_id'],
                    'quantity' => (int) $line['quantity'],
                    'notes' => $line['notes'] ?? null,
                ]);
            }

            $table->update([
                'status' => Table::STATUS_OCCUPIED,
            ]);

            return $order->load([
                'table',
                'user:id,name,username,role',
                'items.menuItem.category',
            ]);
        });

        return response()->json($order, Response::HTTP_CREATED);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json($order->load([
            'table',
            'user:id,name,username,role',
            'items.menuItem.category',
        ]));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $targetStatus = $request->validated('status');
        $user = $request->user();

        if ($targetStatus === Order::STATUS_PAID) {
            throw ValidationException::withMessages([
                'status' => ['Orders can only be marked as paid through the payment endpoint.'],
            ]);
        }

        if (! $order->canTransitionTo($targetStatus)) {
            throw ValidationException::withMessages([
                'status' => ["Invalid status transition from '{$order->status}' to '{$targetStatus}'."],
            ]);
        }

        $allowedRoleByTarget = [
            Order::STATUS_PREPARING => User::ROLE_KITCHEN,
            Order::STATUS_READY => User::ROLE_KITCHEN,
            Order::STATUS_SERVED => User::ROLE_WAITER,
        ];

        $requiredRole = $allowedRoleByTarget[$targetStatus] ?? null;

        if ($requiredRole === null || $user->role !== $requiredRole) {
            return response()->json([
                'message' => "Forbidden. Only {$requiredRole} users can move an order to '{$targetStatus}'.",
            ], Response::HTTP_FORBIDDEN);
        }

        $order->update([
            'status' => $targetStatus,
        ]);

        return response()->json($order->fresh([
            'table',
            'user:id,name,username,role',
            'items.menuItem.category',
        ]));
    }

    public function pay(PayOrderRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();

        $paidOrder = DB::transaction(function () use ($order, $validated): Order {
            /** @var Order $lockedOrder */
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->status === Order::STATUS_PAID) {
                throw ValidationException::withMessages([
                    'status' => ['This order has already been paid.'],
                ]);
            }

            if ($lockedOrder->status !== Order::STATUS_SERVED) {
                throw ValidationException::withMessages([
                    'status' => ["Order must be 'served' before payment (current status: '{$lockedOrder->status}')."],
                ]);
            }

            $totalCents = (int) round(((float) $lockedOrder->total) * 100);
            $amountPaidCents = (int) round(((float) $validated['amount_paid']) * 100);

            if ($amountPaidCents < $totalCents) {
                throw ValidationException::withMessages([
                    'amount_paid' => ["Amount paid must be at least the order total ({$lockedOrder->total})."],
                ]);
            }

            $lockedOrder->update([
                'payment_method' => $validated['payment_method'],
                'amount_paid' => number_format($amountPaidCents / 100, 2, '.', ''),
                'paid_at' => now(),
                'status' => Order::STATUS_PAID,
            ]);

            Table::query()
                ->whereKey($lockedOrder->table_id)
                ->lockForUpdate()
                ->update(['status' => Table::STATUS_AVAILABLE]);

            return $lockedOrder->fresh([
                'table',
                'user:id,name,username,role',
                'items.menuItem.category',
            ]);
        });

        return response()->json([
            'order' => $paidOrder,
            'change' => $paidOrder->change,
        ]);
    }
}
