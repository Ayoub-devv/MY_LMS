<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Course;
use Illuminate\Support\Facades\Storage;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

// Configure Cloudinary directly
$cloudinary = new Cloudinary(
    "cloudinary://174475356175423:6xmoULLmS4waEZ7jH8cRqFzP2UI@dxqp3lwuv"
);

$courses = Course::all();
$migrated = 0;
$skipped = 0;

foreach ($courses as $course) {
    // Skip if already a Cloudinary URL
    if ($course->image && str_starts_with($course->image, 'http')) {
        echo "SKIP (already cloud URL): {$course->title}\n";
        $skipped++;
        continue;
    }

    // Skip if no image
    if (!$course->image) {
        echo "SKIP (no image): {$course->title}\n";
        $skipped++;
        continue;
    }

    // Check if local file exists
    $localPath = storage_path('app/public/' . $course->image);
    if (!file_exists($localPath)) {
        echo "SKIP (file not found): {$course->title}\n";
        $skipped++;
        continue;
    }

    try {
        echo "Uploading: {$course->title}...\n";
        $result = $cloudinary->uploadApi()->upload($localPath, [
            'folder' => 'lms/courses',
            'transformation' => [
                'width' => 800,
                'height' => 500,
                'crop' => 'fill',
                'quality' => 'auto'
            ]
        ]);

        $url = $result['secure_url'];
        $course->image = $url;
        $course->save();
        echo "  ✓ {$url}\n";
        $migrated++;
    } catch (\Exception $e) {
        echo "  ✗ Failed: " . $e->getMessage() . "\n";
    }
}

echo "\n=== Done ===\n";
echo "Migrated : {$migrated}\n";
echo "Skipped  : {$skipped}\n";
