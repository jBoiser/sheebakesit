<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarqueeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('marquee')->insert([
            ['id'=>1,'name'=>'Dubai Chocolate Pistachio','image_url'=>'assets/marquee/1.png'],
            ['id'=>2,'name'=>'Ube Purple Yam Cream Cheese','image_url'=>'assets/marquee/2.png'],
            ['id'=>3,'name'=>'Red Velvet Cream Cheese','image_url'=>'assets/marquee/3.png'],
            ['id'=>4,'name'=>'White Chocolate Matcha','image_url'=>'assets/marquee/4.png'],
            ['id'=>5,'name'=>'Rocky Road','image_url'=>'assets/marquee/5.png'],
            ['id'=>6,'name'=>'Lemon Blueberry','image_url'=>'assets/marquee/6.png'],
            ['id'=>7,'name'=>'Kitkat','image_url'=>'assets/marquee/7.png'],
            ['id'=>8,'name'=>'Lotus Biscoff','image_url'=>'assets/marquee/8.png'],
            ['id'=>9,'name'=>'Brown Butter Pistachio','image_url'=>'assets/marquee/9.png'],
            ['id'=>10,'name'=>'Cookie Monster','image_url'=>'assets/marquee/10.png'],
            ['id'=>11,'name'=>'White Chocolate Macadamia','image_url'=>'assets/marquee/11.png'],
            ['id'=>12,'name'=>'Coconut and Chocolate','image_url'=>'assets/marquee/12.png'],
            ['id'=>13,'name'=>'Funfetti Birthday','image_url'=>'assets/marquee/13.png'],
            ['id'=>14,'name'=>'Oatmeal Raisins','image_url'=>'assets/marquee/14.png'],
            ['id'=>15,'name'=>'Strawberry Overload Soft','image_url'=>'assets/marquee/15.png'],
            ['id'=>16,'name'=>'Nutty Chocolate Chip','image_url'=>'assets/marquee/16.png'],
            ['id'=>17,'name'=>'Double Chocolate','image_url'=>'assets/marquee/17.png'],
            ['id'=>18,'name'=>'Oreo Cookies and Cream','image_url'=>'assets/marquee/18.png'],
            ['id'=>19,'name'=>'Cosmic Brownie','image_url'=>'assets/marquee/19.png'],
            ['id'=>20,'name'=>'Churros Dulce De Leche','image_url'=>'assets/marquee/20.png'],
            ['id'=>21,'name'=>'Snickerdoodle','image_url'=>'assets/marquee/21.png'],
            ['id'=>22,'name'=>'Pumpkin Spice','image_url'=>'assets/marquee/22.png'],
            ['id'=>23,'name'=>'Pumpkin Spices','image_url'=>'assets/marquee/23.png'],
        ]);
    }
}
