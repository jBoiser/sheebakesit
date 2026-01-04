<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarouselSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('carousel')->insert([
            ['id'=>1,'name'=>'Carousel 1','type'=>'Desktop','image_url'=>'assets/carousel/carousel.mp4'],
            ['id'=>2,'name'=>'Carousel 2','type'=>'Desktop','image_url'=>'assets/carousel/carousel2.mp4'],
        ]);
    }
}
