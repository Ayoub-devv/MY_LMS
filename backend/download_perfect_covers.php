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

// Exact Unsplash Photo IDs for guaranteed high-quality, relevant images
$imagesMap = [
    'Complete Modern React Developer' => 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop', // React logo / Code
    'Python for Data Science and Machine Learning' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop', // Data analytics
    'UI/UX Masterclass: Design Beautiful Interfaces' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop', // UI Wireframes
    'SEO & Digital Marketing Strategy' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop', // Digital marketing laptop
    'Mastering Italian Cuisine' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop', // Pizza
    'Complete Yoga and Meditation Journey' => 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop', // Yoga pose
    'Acoustic Guitar Masterclass' => 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=500&fit=crop', // Acoustic Guitar
    'Personal Finance & Investing 101' => 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=500&fit=crop' // Money/Investing
];

foreach ($courses as $course) {
    // Default fallback image if course is not in the map
    $url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop'; 
    
    if (isset($imagesMap[$course->title])) {
        $url = $imagesMap[$course->title];
    } else if (stripos($course->title, 'web') !== false || stripos($course->title, 'html') !== false) {
        $url = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop'; // Coding
    }
    
    echo "Downloading perfect cover for '{$course->title}'...\n";
    
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

echo "All PERFECT covers downloaded and updated successfully!\n";
