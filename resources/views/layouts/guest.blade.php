<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }}</title>

    {{-- Custom CSS --}}
    @stack('styles')
</head>

<body style="margin:0; padding:0;">
    {{ $slot }}

    {{-- Custom scripts --}}
    @stack('scripts')
</body>
</html>
