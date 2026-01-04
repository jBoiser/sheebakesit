<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CakesSeeder::class,
            CookiesSeeder::class,
            MarqueeSeeder::class,
            FooterSeeder::class,
            CarouselSeeder::class,
        ]);
    }
}
