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

$keywordsMap = [
    'Complete Modern React Developer' => 'programming,code',
    'Python for Data Science and Machine Learning' => 'data,technology',
    'UI/UX Masterclass: Design Beautiful Interfaces' => 'ui,design',
    'SEO & Digital Marketing Strategy' => 'marketing,business',
    'Mastering Italian Cuisine' => 'pizza,pasta',
    'Complete Yoga and Meditation Journey' => 'yoga,meditation',
    'Acoustic Guitar Masterclass' => 'guitar,acoustic',
    'Personal Finance & Investing 101' => 'money,finance'
];

foreach ($courses as $course) {
    // If it's one of the older courses, assign a generic keyword based on its title
    $keyword = 'education,learning';
    if (isset($keywordsMap[$course->title])) {
        $keyword = $keywordsMap[$course->title];
    } else if (stripos($course->title, 'web') !== false || stripos($course->title, 'html') !== false) {
        $keyword = 'website,code';
    }
    
    // LoremFlickr URL format: https://loremflickr.com/width/height/keyword1,keyword2
    $url = "https://loremflickr.com/800/500/{$keyword}";
    
    echo "Downloading new cover for '{$course->title}' using keyword '{$keyword}'...\n";
    
    try {
        $response = Http::timeout(15)->get($url);
        if ($response->successful()) {
            $imageContents = $response->body();
            $filename = 'courses/' . Str::slug($course->title) . '.jpg';
            
            Storage::disk('public')->put($filename, $imageContents);
            
            $course->image = $filename;
            $course->save();
            
            echo "Saved {$filename}\n";
        } else {
            echo "Failed HTTP request for '{$course->title}'\n";
        }
    } catch (\Exception $e) {
        echo "Failed to download for '{$course->title}': " . $e->getMessage() . "\n";
    }
}

echo "All new covers downloaded and updated successfully!\n";
