<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Course;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

$c = Course::where('title', 'Personal Finance & Investing 101')->first();
if ($c) {
    $img = Http::get('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop')->body();
    Storage::disk('public')->put('courses/finance.jpg', $img);
    $c->image = 'courses/finance.jpg';
    $c->save();
    echo "Finance fixed!\n";
}
