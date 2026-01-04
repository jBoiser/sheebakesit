<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id', 'reference_no', 'customer_name', 'address', 'contact', 'email',
        'payment_mode', 'delivery_mode', 'proof_image', 'comments', 'total_amount', 'status'
    ];
}
