<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;

$courses = Course::with('chapters.lessons')->get();

$videosMap = [
    'Complete Modern React Developer' => 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    'Python for Data Science and Machine Learning' => 'https://www.youtube.com/watch?v=x9q8U0E-G2E',
    'UI/UX Masterclass: Design Beautiful Interfaces' => 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
    'SEO & Digital Marketing Strategy' => 'https://www.youtube.com/watch?v=DvwS7cV9GmQ',
    'Mastering Italian Cuisine' => 'https://www.youtube.com/watch?v=jDLO19pWJ_Q',
    'Complete Yoga and Meditation Journey' => 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    'Acoustic Guitar Masterclass' => 'https://www.youtube.com/watch?v=BBz-Jyr23M4',
    'Personal Finance & Investing 101' => 'https://www.youtube.com/watch?v=HQzoZfc3GwQ'
];

foreach ($courses as $course) {
    if (isset($videosMap[$course->title])) {
        $videoUrl = $videosMap[$course->title];
        foreach ($course->chapters as $chapter) {
            foreach ($chapter->lessons as $lesson) {
                $lesson->video = $videoUrl;
                $lesson->save();
                echo "Updated lesson {$lesson->id} for course '{$course->title}'\n";
            }
        }
    }
}
echo "Done!\n";
