<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CookiesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cookies')->insert([
            ['id'=>'co1','name'=>'Dubai Chocolate Pistachio','price'=>3.00,'image_url'=>'assets/cookies/dubai.jpg','status'=>'active','category'=>'Best Seller'],
            ['id'=>'co10','name'=>'Cookie Monster','price'=>3.00,'image_url'=>'assets/cookies/monster.jpg','status'=>'active','category'=>'Featured'],
            ['id'=>'co11','name'=>'White Chocolate Macadamia','price'=>3.00,'image_url'=>'assets/cookies/macadamia.jpg','status'=>'active','category'=>'Featured'],
            ['id'=>'co12','name'=>'Coconut and Chocolate','price'=>3.00,'image_url'=>'assets/cookies/coconut.jpg','status'=>'active','category'=>'Featured'],
            ['id'=>'co13','name'=>'Funfetti Birthday','price'=>3.00,'image_url'=>'assets/cookies/funfetti.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co14','name'=>'Oatmeal Raisins','price'=>3.00,'image_url'=>'assets/cookies/oatmeal.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co15','name'=>'Strawberry Overload Soft','price'=>3.00,'image_url'=>'assets/cookies/strawberry.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co16','name'=>'Nutty Chocolate Chip','price'=>3.00,'image_url'=>'assets/cookies/nutty.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co17','name'=>'Double Chocolate','price'=>3.00,'image_url'=>'assets/cookies/double.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co18','name'=>'Oreo Cookies and Cream','price'=>3.00,'image_url'=>'assets/cookies/oreo.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co19','name'=>'Cosmic Brownie','price'=>3.00,'image_url'=>'assets/cookies/cosmic.jpg','status'=>'active','category'=>'Featured'],
            ['id'=>'co2','name'=>'Ube Purple Yam Cream Cheese','price'=>3.00,'image_url'=>'assets/cookies/ube.jpg','status'=>'active','category'=>'Best Seller'],
            ['id'=>'co20','name'=>'Churros Dulce De Leche','price'=>3.00,'image_url'=>'assets/cookies/churros.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co21','name'=>'Snickerdoodle','price'=>3.00,'image_url'=>'assets/cookies/snicker.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co22','name'=>'Pumpkin Spice','price'=>3.00,'image_url'=>'assets/cookies/pumpkin.jpg','status'=>'inactive','category'=>'Featured'],
            ['id'=>'co23','name'=>'Peanut Butter','price'=>3.00,'image_url'=>'assets/cookies/peanut.jpg','status'=>'active','category'=>'Featured'],
            ['id'=>'co3','name'=>'Red Velvet Cream Cheese','price'=>3.00,'image_url'=>'assets/cookies/red.jpg','status'=>'active','category'=>'Best Seller'],
            ['id'=>'co4','name'=>'White Chocolate Matcha','price'=>3.00,'image_url'=>'assets/cookies/matcha.jpg','status'=>'active','category'=>'Best Seller'],
            ['id'=>'co5','name'=>'Rocky Road','price'=>3.00,'image_url'=>'assets/cookies/rocky.jpg','status'=>'active','category'=>'Classic'],
            ['id'=>'co6','name'=>'Lemon Blueberry','price'=>3.00,'image_url'=>'assets/cookies/lemon.jpg','status'=>'active','category'=>'Featured'],
            ['id'=>'co7','name'=>'Kitkat','price'=>3.00,'image_url'=>'assets/cookies/kitkat.jpg','status'=>'active','category'=>'Featured'],
            ['id'=>'co8','name'=>'Lotus Biscoff','price'=>3.00,'image_url'=>'assets/cookies/lotus.jpg','status'=>'active','category'=>'Featured'],
            ['id'=>'co9','name'=>'Brown Butter Pistachio','price'=>3.00,'image_url'=>'assets/cookies/brown.jpg','status'=>'active','category'=>'Featured'],
        ]);
    }
}
