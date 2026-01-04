<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CakesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cakes')->insert([
            ['id' => 'ca1', 'name' => 'Lotus Biscoff', 'size' => '4"', 'price' => 25.00, 'image_url' => 'assets/cakes/biscoff.jpg', 'status' => 'active'],
            ['id' => 'ca2', 'name' => 'Lotus Biscoff', 'size' => '6"', 'price' => 40.00, 'image_url' => 'assets/cakes/biscoff.jpg', 'status' => 'active'],
            ['id' => 'ca3', 'name' => 'Lotus Biscoff', 'size' => '8"', 'price' => 55.00, 'image_url' => 'assets/cakes/biscoff.jpg', 'status' => 'active'],
            ['id' => 'ca4', 'name' => 'Lotus Biscoff', 'size' => '9"', 'price' => 65.00, 'image_url' => 'assets/cakes/biscoff.jpg', 'status' => 'active'],
            
            ['id' => 'ca5', 'name' => 'Red Velvet', 'size' => '4"', 'price' => 25.00, 'image_url' => 'assets/cakes/redvelvet.jpg', 'status' => 'active'],
            ['id' => 'ca6', 'name' => 'Red Velvet', 'size' => '6"', 'price' => 40.00, 'image_url' => 'assets/cakes/redvelvet.jpg', 'status' => 'active'],
            ['id' => 'ca7', 'name' => 'Red Velvet', 'size' => '8"', 'price' => 55.00, 'image_url' => 'assets/cakes/redvelvet.jpg', 'status' => 'active'],
            ['id' => 'ca8', 'name' => 'Red Velvet', 'size' => '9"', 'price' => 65.00, 'image_url' => 'assets/cakes/redvelvet.jpg', 'status' => 'active'],

            ['id' => 'ca9',  'name' => 'Pistachio', 'size' => '4"', 'price' => 25.00, 'image_url' => 'assets/cakes/pistachio.jpg', 'status' => 'active'],
            ['id' => 'ca10', 'name' => 'Pistachio', 'size' => '6"', 'price' => 40.00, 'image_url' => 'assets/cakes/pistachio.jpg', 'status' => 'active'],
            ['id' => 'ca11', 'name' => 'Pistachio', 'size' => '8"', 'price' => 55.00, 'image_url' => 'assets/cakes/pistachio.jpg', 'status' => 'active'],
            ['id' => 'ca12', 'name' => 'Pistachio', 'size' => '9"', 'price' => 65.00, 'image_url' => 'assets/cakes/pistachio.jpg', 'status' => 'active'],

            ['id' => 'ca13', 'name' => 'Matilda Chocolate', 'size' => '4"', 'price' => 25.00, 'image_url' => 'assets/cakes/matilda.jpg', 'status' => 'active'],
            ['id' => 'ca14', 'name' => 'Casava (Yuka)',       'size' => '—', 'price' => 15.00, 'image_url' => 'assets/cakes/casavva.jpg', 'status' => 'active'],
        ]);
    }
}
