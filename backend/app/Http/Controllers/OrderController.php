<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\CancelOrderRequest;
use App\Http\Requests\Order\PayOrderRequest;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderItemsRequest;
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
        $query = Order::query()->with($this->orderRelations());

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

        if ($request->filled('payment_status')) {
            $paymentStatus = trim((string) $request->query('payment_status'));
            if (! in_array($paymentStatus, Order::PAYMENT_STATUSES, true)) {
                throw ValidationException::withMessages([
                    'payment_status' => ["Invalid payment_status filter: {$paymentStatus}"],
                ]);
            }

            $query->where('payment_status', $paymentStatus);
        }

        // Kitchen queue filters are FIFO (oldest first); full feed is newest first.
        $isActiveQueue = $statuses !== []
            && ! in_array(Order::STATUS_PAID, $statuses, true)
            && ! in_array(Order::STATUS_CANCELLED, $statuses, true);

        $query->orderBy('created_at', $isActiveQueue ? 'asc' : 'desc')
            ->orderBy('id', $isActiveQueue ? 'asc' : 'desc');

        return response()->json($query->get());
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $allowOccupied = (bool) ($validated['allow_occupied'] ?? false);
        $user = $request->user();

        $order = DB::transaction(function () use ($validated, $allowOccupied, $user): Order {
            /** @var Table $table */
            $table = Table::query()->lockForUpdate()->findOrFail($validated['table_id']);

            if (! $allowOccupied && $table->status !== Table::STATUS_AVAILABLE) {
                throw ValidationException::withMessages([
                    'table_id' => ["Table {$table->table_number} is currently occupied and cannot start a new order."],
                ]);
            }

            [$linePayloads, $totalCents] = $this->prepareValidatedLines($validated['items']);

            $order = Order::query()->create([
                'table_id' => $table->id,
                'user_id' => $user->id,
                'status' => Order::STATUS_PENDING,
                'payment_status' => Order::PAYMENT_UNPAID,
                'total' => number_format($totalCents / 100, 2, '.', ''),
            ]);

            $orderRef = 'ORD-'.(1000 + $order->id);
            $order->update(['order_ref' => $orderRef]);

            foreach ($linePayloads as $payload) {
                $order->items()->create($payload);
            }

            $table->update([
                'status' => Table::STATUS_OCCUPIED,
                'active_order_id' => $order->id,
                'active_order_ref' => $orderRef,
            ]);

            return $order->fresh($this->orderRelations());
        });

        return response()->json($order, Response::HTTP_CREATED);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json($order->load($this->orderRelations()));
    }

    public function updateItems(UpdateOrderItemsRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();

        $updated = DB::transaction(function () use ($order, $validated): Order {
            /** @var Order $lockedOrder */
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->payment_status === Order::PAYMENT_PAID) {
                throw ValidationException::withMessages([
                    'status' => ['Paid orders cannot be edited. Create an Extra Food order instead.'],
                ]);
            }

            if ($lockedOrder->status === Order::STATUS_CANCELLED) {
                throw ValidationException::withMessages([
                    'status' => ['Cancelled orders cannot be edited.'],
                ]);
            }

            [$linePayloads, $totalCents] = $this->prepareValidatedLines($validated['items']);

            $lockedOrder->items()->delete();
            foreach ($linePayloads as $payload) {
                $lockedOrder->items()->create($payload);
            }

            $lockedOrder->update([
                'total' => number_format($totalCents / 100, 2, '.', ''),
            ]);

            return $lockedOrder->fresh($this->orderRelations());
        });

        return response()->json($updated);
    }

    public function addItems(UpdateOrderItemsRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();

        $updated = DB::transaction(function () use ($order, $validated): Order {
            /** @var Order $lockedOrder */
            $lockedOrder = Order::query()->with('items')->lockForUpdate()->findOrFail($order->id);

            if (in_array($lockedOrder->status, [Order::STATUS_PAID, Order::STATUS_CANCELLED], true)) {
                throw ValidationException::withMessages([
                    'status' => ['Cannot add items to a completed or cancelled order.'],
                ]);
            }

            [$linePayloads, $addedCents] = $this->prepareValidatedLines($validated['items']);

            $existingCents = 0;
            foreach ($lockedOrder->items as $existingItem) {
                $existingCents += (int) round(((float) $existingItem->unit_price) * 100) * (int) $existingItem->quantity;
            }

            foreach ($linePayloads as $payload) {
                $lockedOrder->items()->create($payload);
            }

            $lockedOrder->update([
                'total' => number_format(($existingCents + $addedCents) / 100, 2, '.', ''),
            ]);

            return $lockedOrder->fresh($this->orderRelations());
        });

        return response()->json($updated);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $targetStatus = $request->validated('status');
        $user = $request->user();

        if ($order->status === Order::STATUS_CANCELLED) {
            throw ValidationException::withMessages([
                'status' => ['Cancelled orders cannot change status.'],
            ]);
        }

        if ($order->payment_status !== Order::PAYMENT_PAID) {
            throw ValidationException::withMessages([
                'status' => ['Order must be paid before kitchen preparation or service can proceed.'],
            ]);
        }

        if (! $order->canTransitionTo($targetStatus)) {
            throw ValidationException::withMessages([
                'status' => ["Invalid status transition from '{$order->status}' to '{$targetStatus}'."],
            ]);
        }

        $allowedRolesByTarget = [
            Order::STATUS_PREPARING => [User::ROLE_KITCHEN, User::ROLE_ADMIN],
            Order::STATUS_READY => [User::ROLE_KITCHEN, User::ROLE_ADMIN],
            Order::STATUS_SERVED => [User::ROLE_WAITER, User::ROLE_ADMIN],
            Order::STATUS_PAID => [User::ROLE_WAITER, User::ROLE_ADMIN],
        ];

        $allowedRoles = $allowedRolesByTarget[$targetStatus] ?? [];

        if (! in_array($user->role, $allowedRoles, true)) {
            return response()->json([
                'message' => "Forbidden. Your role cannot move an order to '{$targetStatus}'.",
            ], Response::HTTP_FORBIDDEN);
        }

        $order->update([
            'status' => $targetStatus,
        ]);

        return response()->json($order->fresh($this->orderRelations()));
    }

    public function pay(PayOrderRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();

        $paidOrder = DB::transaction(function () use ($order, $validated): Order {
            /** @var Order $lockedOrder */
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->status === Order::STATUS_CANCELLED) {
                throw ValidationException::withMessages([
                    'status' => ['Cancelled orders cannot be paid.'],
                ]);
            }

            if ($lockedOrder->payment_status === Order::PAYMENT_PAID) {
                throw ValidationException::withMessages([
                    'status' => ['This order has already been paid.'],
                ]);
            }

            $totalCents = (int) round(((float) $lockedOrder->total) * 100);
            $amountPaidCents = (int) round(((float) $validated['amount_paid']) * 100);
            $method = $validated['payment_method'];

            if ($amountPaidCents < $totalCents) {
                throw ValidationException::withMessages([
                    'amount_paid' => ["Amount paid must be at least the order total ({$lockedOrder->total})."],
                ]);
            }

            if (in_array($method, [Order::PAYMENT_GCASH, Order::PAYMENT_CARD], true) && $amountPaidCents !== $totalCents) {
                throw ValidationException::withMessages([
                    'amount_paid' => ["Digital payments ({$method}) must match the exact order total ({$lockedOrder->total})."],
                ]);
            }

            $now = now();

            // Pay-First, Dine-After: mark payment_status='paid', keep status='pending' so
            // the Kitchen Display receives the ticket, start prep timer at paid moment,
            // and keep the table occupied until guests finish dining.
            $lockedOrder->update([
                'payment_status' => Order::PAYMENT_PAID,
                'status' => Order::STATUS_PENDING,
                'payment_method' => $method,
                'amount_paid' => number_format($amountPaidCents / 100, 2, '.', ''),
                'paid_at' => $now,
                'created_at' => $now,
            ]);

            Table::query()
                ->whereKey($lockedOrder->table_id)
                ->lockForUpdate()
                ->update([
                    'status' => Table::STATUS_OCCUPIED,
                    'active_order_id' => $lockedOrder->id,
                    'active_order_ref' => $lockedOrder->order_ref,
                ]);

            return $lockedOrder->fresh($this->orderRelations());
        });

        return response()->json($paidOrder);
    }

    public function cancel(CancelOrderRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();
        $actorId = $request->user()->id;

        $cancelledOrder = DB::transaction(function () use ($order, $validated, $actorId): Order {
            /** @var Order $lockedOrder */
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->status === Order::STATUS_CANCELLED) {
                throw ValidationException::withMessages([
                    'status' => ['This order is already cancelled.'],
                ]);
            }

            if ($lockedOrder->status === Order::STATUS_PAID) {
                throw ValidationException::withMessages([
                    'status' => ['Completed dining orders cannot be cancelled.'],
                ]);
            }

            $lockedOrder->update([
                'status' => Order::STATUS_CANCELLED,
                'cancellation_reason' => trim($validated['reason']),
                'cancelled_by' => $actorId,
            ]);

            $remainingActive = Order::query()
                ->where('table_id', $lockedOrder->table_id)
                ->whereKeyNot($lockedOrder->id)
                ->whereIn('status', Order::ACTIVE_STATUSES)
                ->latest('id')
                ->first();

            /** @var Table $table */
            $table = Table::query()->lockForUpdate()->findOrFail($lockedOrder->table_id);

            if ($remainingActive) {
                $table->update([
                    'status' => Table::STATUS_OCCUPIED,
                    'active_order_id' => $remainingActive->id,
                    'active_order_ref' => $remainingActive->order_ref,
                ]);
            } else {
                $table->update([
                    'status' => Table::STATUS_AVAILABLE,
                    'active_order_id' => null,
                    'active_order_ref' => null,
                ]);
            }

            return $lockedOrder->fresh($this->orderRelations());
        });

        return response()->json($cancelledOrder);
    }

    /**
     * Validate menu item availability and compute snapshotted line items + server-side total in cents.
     *
     * @param  array<int, array<string, mixed>>  $items
     * @return array{0: list<array<string, mixed>>, 1: int}
     */
    private function prepareValidatedLines(array $items): array
    {
        $menuItemIds = collect($items)
            ->pluck('menu_item_id')
            ->unique()
            ->values();

        $menuItems = MenuItem::query()
            ->whereIn('id', $menuItemIds)
            ->get()
            ->keyBy('id');

        $soldOutNames = [];
        $totalCents = 0;
        $linePayloads = [];

        foreach ($items as $line) {
            /** @var MenuItem $menuItem */
            $menuItem = $menuItems->get($line['menu_item_id']);

            if (! $menuItem->is_available) {
                $soldOutNames[] = $menuItem->name;

                continue;
            }

            $unitCents = (int) round(((float) $menuItem->price) * 100);
            $quantity = (int) $line['quantity'];
            $totalCents += $unitCents * $quantity;

            $linePayloads[] = [
                'menu_item_id' => $menuItem->id,
                'unit_price' => number_format($unitCents / 100, 2, '.', ''),
                'quantity' => $quantity,
                'notes' => isset($line['notes']) && $line['notes'] !== '' ? (string) $line['notes'] : null,
            ];
        }

        if ($soldOutNames !== []) {
            $uniqueSoldOut = implode(', ', array_unique($soldOutNames));
            throw ValidationException::withMessages([
                'items' => ["Cannot order sold out item(s): {$uniqueSoldOut}."],
            ]);
        }

        return [$linePayloads, $totalCents];
    }

    /**
     * @return list<string>
     */
    private function orderRelations(): array
    {
        return [
            'table',
            'user:id,name,username,role',
            'items.menuItem.category',
        ];
    }
}
