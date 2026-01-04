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
        Schema::create('cookies', function (Blueprint $table) {
            $table->string('id')->primary(); // co1, co2...
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->string('image_url');
            $table->enum('status', ['active', 'inactive']);
            $table->enum('category', ['Best Seller','Featured','Classic']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cookies');
    }
};
