<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->timestamp('cancelled_at')->nullable()->after('cancelled_by');
            $table->index(['payment_status', 'status', 'paid_at'], 'orders_payment_status_paid_at_idx');
            $table->index(['table_id', 'status'], 'orders_table_status_idx');
            $table->index(['status', 'cancelled_at'], 'orders_status_cancelled_at_idx');
        });

        Schema::table('tables', function (Blueprint $table): void {
            $table->foreign('active_order_id')
                ->references('id')
                ->on('orders')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tables', function (Blueprint $table): void {
            $table->dropForeign(['active_order_id']);
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropIndex('orders_payment_status_paid_at_idx');
            $table->dropIndex('orders_table_status_idx');
            $table->dropIndex('orders_status_cancelled_at_idx');
            $table->dropColumn('cancelled_at');
        });
    }
};
