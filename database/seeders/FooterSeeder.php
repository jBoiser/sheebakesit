<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FooterSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('footer')->insert([
            ['id'=>1,'asset_id'=>'logo','name'=>'Main Logo','image_url'=>'assets/footers/logo1.png'],
            ['id'=>2,'asset_id'=>'qr1','name'=>'Facebook QR','image_url'=>'assets/footers/face.png'],
            ['id'=>3,'asset_id'=>'qr2','name'=>'Instagram QR','image_url'=>'assets/footers/insta.png'],
            ['id'=>4,'asset_id'=>'logo2','name'=>'Shee Bakes It','image_url'=>'assets/footers/logo2.png'],
            ['id'=>5,'asset_id'=>'about1','name'=>'Simply Image','image_url'=>'assets/footers/simply.png'],
            ['id'=>6,'asset_id'=>'about2','name'=>'Delicious Image','image_url'=>'assets/footers/delicious.png'],
            ['id'=>7,'asset_id'=>'about3','name'=>'Home Bakes Image','image_url'=>'assets/footers/homebakes.png'],
        ]);
    }
}
