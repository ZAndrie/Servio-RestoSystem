<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\JsonResponse;

class TableController extends Controller
{
    public function index(): JsonResponse
    {
        $tables = Table::query()
            ->with(['activeOrder' => function ($query) {
                $query->select('orders.id', 'orders.table_id', 'orders.user_id', 'orders.status', 'orders.total', 'orders.created_at');
            }])
            ->orderBy('id')
            ->get();

        return response()->json($tables);
    }
}
