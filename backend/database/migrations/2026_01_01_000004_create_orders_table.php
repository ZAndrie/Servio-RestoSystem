<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_ref', 20)->nullable()->unique();
            $table->foreignId('table_id')->constrained('tables')->restrictOnDelete();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->enum('status', ['pending', 'preparing', 'ready', 'served', 'paid', 'cancelled'])
                ->default('pending')
                ->index();
            $table->enum('payment_status', ['unpaid', 'paid'])
                ->default('unpaid')
                ->index();
            $table->decimal('service_charge', 10, 2)->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->enum('payment_method', ['cash', 'gcash', 'card'])->nullable();
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->string('cancellation_reason', 255)->nullable();
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('paid_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
