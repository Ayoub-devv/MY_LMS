<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

$courses = Course::all();

// Ensure the directory exists
Storage::disk('public')->makeDirectory('courses');

$seeds = [
    'Complete Modern React Developer' => 'laptop',
    'Python for Data Science and Machine Learning' => 'data',
    'UI/UX Masterclass: Design Beautiful Interfaces' => 'design',
    'SEO & Digital Marketing Strategy' => 'marketing',
    'Mastering Italian Cuisine' => 'pizza',
    'Complete Yoga and Meditation Journey' => 'yoga',
    'Acoustic Guitar Masterclass' => 'guitar',
    'Personal Finance & Investing 101' => 'finance'
];

foreach ($courses as $course) {
    $seed = $seeds[$course->title] ?? 'course';
    $url = "https://picsum.photos/seed/{$seed}/800/500";
    
    echo "Downloading cover for '{$course->title}'...\n";
    
    try {
        $imageContents = Http::get($url)->body();
        $filename = 'courses/' . Str::slug($course->title) . '.jpg';
        
        Storage::disk('public')->put($filename, $imageContents);
        
        $course->image = $filename;
        $course->save();
        
        echo "Saved {$filename}\n";
    } catch (\Exception $e) {
        echo "Failed to download for '{$course->title}': " . $e->getMessage() . "\n";
    }
}

echo "All covers downloaded and updated successfully!\n";
