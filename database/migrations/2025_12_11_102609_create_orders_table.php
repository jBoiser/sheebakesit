<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id'); // SBI-01
            $table->string('reference_no')->nullable();
            $table->string('customer_name');
            $table->string('address');
            $table->string('contact');
            $table->string('email');
            $table->string('payment_mode');
            $table->string('delivery_mode')->nullable();
            $table->string('proof_image')->nullable();
            $table->longText('comments')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
