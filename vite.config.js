import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                // Landing Page Assets
                'resources/css/style.css',
                'resources/js/script.js',

                // Login Page Assets
                'resources/css/login.css',

                // Dashboard Assets
                'resources/css/dashboard.css',
                'resources/css/cookies.css',
                'resources/css/cakes.css',
                'resources/css/orders.css',
                'resources/css/gallery.css',
                'resources/css/gallerysection.css',
                'resources/js/dashboard.js',
                'resources/js/cookies.js',
                'resources/js/cakes.js',
                'resources/js/orders.js',
                'resources/js/gallery.js',
                 'resources/js/gallerysection.js',
            ],
            refresh: true,
        }),
    ],
});