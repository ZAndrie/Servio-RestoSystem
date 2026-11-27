<?php

namespace App\Http\Controllers;

use App\Http\Requests\Table\OccupyTableRequest;
use App\Http\Requests\Table\ReleaseTableRequest;
use App\Models\Order;
use App\Models\Table;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TableController extends Controller
{
    public function index(): JsonResponse
    {
        $tables = Table::query()
            ->with(['activeOrder' => function ($query) {
                $query->select(
                    'orders.id',
                    'orders.order_ref',
                    'orders.table_id',
                    'orders.user_id',
                    'orders.status',
                    'orders.payment_status',
                    'orders.total',
                    'orders.created_at'
                );
            }])
            ->orderBy('id')
            ->get();

        return response()->json($tables);
    }

    public function occupy(OccupyTableRequest $request, Table $table): JsonResponse
    {
        $validated = $request->validated();

        $updated = DB::transaction(function () use ($table, $validated): Table {
            /** @var Table $lockedTable */
            $lockedTable = Table::query()->lockForUpdate()->findOrFail($table->id);
            /** @var Order $order */
            $order = Order::query()->findOrFail($validated['order_id']);

            $lockedTable->update([
                'status' => Table::STATUS_OCCUPIED,
                'active_order_id' => $order->id,
                'active_order_ref' => $validated['order_ref'] ?? $order->order_ref,
            ]);

            return $lockedTable->fresh('activeOrder');
        });

        return response()->json($updated);
    }

    public function release(ReleaseTableRequest $request, Table $table): JsonResponse
    {
        $force = $request->boolean('force', false);
        $actorId = $request->user()?->id;

        $result = DB::transaction(function () use ($table, $force, $actorId): array {
            /** @var Table $lockedTable */
            $lockedTable = Table::query()->lockForUpdate()->findOrFail($table->id);

            $activeOrders = Order::query()
                ->where('table_id', $lockedTable->id)
                ->whereIn('status', Order::ACTIVE_STATUSES)
                ->lockForUpdate()
                ->get();

            $unpaidOrders = $activeOrders->where('payment_status', Order::PAYMENT_UNPAID);
            if (! $force && $unpaidOrders->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'table' => ['This table has an unpaid order. Collect payment or cancel it before clearing the table.'],
                ]);
            }

            $unservedPaidOrders = $activeOrders->filter(
                fn (Order $order): bool => $order->payment_status === Order::PAYMENT_PAID
                    && in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PREPARING, Order::STATUS_READY], true)
            );

            if (! $force && $unservedPaidOrders->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'table' => ['This table still has paid orders in the kitchen that have not been served yet.'],
                ]);
            }

            $archivedOrders = [];

            foreach ($activeOrders as $order) {
                if ($order->payment_status === Order::PAYMENT_PAID) {
                    $order->update(['status' => Order::STATUS_PAID]);
                } else {
                    $order->update([
                        'status' => Order::STATUS_CANCELLED,
                        'cancellation_reason' => 'Table force-cleared',
                        'cancelled_by' => $actorId,
                    ]);
                }

                $archivedOrders[] = $order->fresh([
                    'table',
                    'user:id,name,username,role',
                    'items.menuItem.category',
                ]);
            }

            $lockedTable->update([
                'status' => Table::STATUS_AVAILABLE,
                'active_order_id' => null,
                'active_order_ref' => null,
            ]);

            return [
                'table' => $lockedTable->fresh(),
                'orders' => $archivedOrders,
            ];
        });

        return response()->json($result);
    }
}
