<?php

namespace App\Http\Controllers;

use App\Http\Requests\Report\DailyReportRequest;
use App\Models\Order;
use App\Models\Table;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function daily(DailyReportRequest $request): JsonResponse
    {
        $date = $request->validated('date') ?? now()->toDateString();
        $start = Carbon::parse($date)->startOfDay();
        $end = Carbon::parse($date)->endOfDay();

        $paidOrders = Order::query()
            ->with([
                'table',
                'user:id,name,username',
                'items.menuItem',
            ])
            ->where('status', Order::STATUS_PAID)
            ->whereBetween('paid_at', [$start, $end])
            ->orderBy('paid_at', 'asc')
            ->get();

        $totalSalesCents = 0;
        $byPaymentMethod = [];
        foreach (Order::PAYMENT_METHODS as $method) {
            $byPaymentMethod[$method] = [
                'count' => 0,
                'total_cents' => 0,
            ];
        }

        $itemsSold = [];

        foreach ($paidOrders as $order) {
            $orderCents = (int) round(((float) $order->total) * 100);
            $totalSalesCents += $orderCents;

            if ($order->payment_method && isset($byPaymentMethod[$order->payment_method])) {
                $byPaymentMethod[$order->payment_method]['count']++;
                $byPaymentMethod[$order->payment_method]['total_cents'] += $orderCents;
            }

            foreach ($order->items as $item) {
                $menuItemId = $item->menu_item_id;
                if (! isset($itemsSold[$menuItemId])) {
                    $itemsSold[$menuItemId] = [
                        'menu_item_id' => $menuItemId,
                        'name' => $item->menuItem?->name ?? 'Unknown Item',
                        'quantity_sold' => 0,
                    ];
                }
                $itemsSold[$menuItemId]['quantity_sold'] += $item->quantity;
            }
        }

        $orderCount = $paidOrders->count();
        $averageOrderCents = $orderCount > 0 ? (int) round($totalSalesCents / $orderCount) : 0;

        $formattedPaymentMethods = [];
        foreach ($byPaymentMethod as $method => $stats) {
            $formattedPaymentMethods[$method] = [
                'count' => $stats['count'],
                'total' => number_format($stats['total_cents'] / 100, 2, '.', ''),
            ];
        }

        usort($itemsSold, fn (array $a, array $b): int => $b['quantity_sold'] <=> $a['quantity_sold']);

        return response()->json([
            'date' => $date,
            'summary' => [
                'total_sales' => number_format($totalSalesCents / 100, 2, '.', ''),
                'order_count' => $orderCount,
                'average_order_value' => number_format($averageOrderCents / 100, 2, '.', ''),
                'by_payment_method' => $formattedPaymentMethods,
            ],
            'items_sold' => array_values($itemsSold),
            'orders' => $paidOrders,
        ]);
    }

    public function dashboard(): JsonResponse
    {
        $today = now()->toDateString();
        $start = now()->startOfDay();
        $end = now()->endOfDay();

        $paidTodayQuery = Order::query()
            ->where('status', Order::STATUS_PAID)
            ->whereBetween('paid_at', [$start, $end]);

        $paidOrdersToday = (clone $paidTodayQuery)->count();
        $todaySales = (float) ((clone $paidTodayQuery)->sum('total') ?? 0);

        $activeCounts = Order::query()
            ->selectRaw('status, COUNT(*) as count')
            ->whereIn('status', [
                Order::STATUS_PENDING,
                Order::STATUS_PREPARING,
                Order::STATUS_READY,
                Order::STATUS_SERVED,
            ])
            ->groupBy('status')
            ->pluck('count', 'status');

        $ordersByStatus = [
            Order::STATUS_PENDING => (int) ($activeCounts[Order::STATUS_PENDING] ?? 0),
            Order::STATUS_PREPARING => (int) ($activeCounts[Order::STATUS_PREPARING] ?? 0),
            Order::STATUS_READY => (int) ($activeCounts[Order::STATUS_READY] ?? 0),
            Order::STATUS_SERVED => (int) ($activeCounts[Order::STATUS_SERVED] ?? 0),
            'paid_today' => $paidOrdersToday,
        ];

        $activeOrdersCount = $ordersByStatus[Order::STATUS_PENDING]
            + $ordersByStatus[Order::STATUS_PREPARING]
            + $ordersByStatus[Order::STATUS_READY]
            + $ordersByStatus[Order::STATUS_SERVED];

        $tableCounts = Table::query()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $availableTables = (int) ($tableCounts[Table::STATUS_AVAILABLE] ?? 0);
        $occupiedTables = (int) ($tableCounts[Table::STATUS_OCCUPIED] ?? 0);

        $recentOrders = Order::query()
            ->with([
                'table',
                'user:id,name,username,role',
            ])
            ->latest('created_at')
            ->limit(10)
            ->get();

        return response()->json([
            'date' => $today,
            'today_sales' => number_format($todaySales, 2, '.', ''),
            'paid_orders_today' => $paidOrdersToday,
            'active_orders_count' => $activeOrdersCount,
            'orders_by_status' => $ordersByStatus,
            'tables' => [
                'total' => $availableTables + $occupiedTables,
                'available' => $availableTables,
                'occupied' => $occupiedTables,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }
}
