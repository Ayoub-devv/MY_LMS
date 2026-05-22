<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\level;
use App\Models\Course;
use App\Models\chapter;
use App\Models\lesson;
use App\Models\User;

class NonITCoursesSeeder extends Seeder
{
    public function run()
    {
        // 1. Fix previous YouTube URLs to dummy.mp4 so the player works!
        $lessonsWithYT = lesson::where('video', 'like', '%youtube.com%')->get();
        foreach ($lessonsWithYT as $l) {
            $l->video = 'lessons/dummy.mp4';
            $l->save();
        }

        // 2. Ensure we have an admin/user
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@lms.com',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]);
        }

        // 3. New Categories (Non-IT)
        $categories = ['Culinary Arts', 'Fitness & Health', 'Music & Instruments', 'Business & Finance'];
        $catIds = [];
        foreach ($categories as $cat) {
            $c = Category::firstOrCreate(['name' => $cat]);
            $catIds[] = $c->id;
        }

        // 4. Levels
        $levels = ['Beginner', 'Intermediate', 'Advanced'];
        $levelIds = [];
        foreach ($levels as $lvl) {
            $l = level::firstOrCreate(['name' => $lvl]);
            $levelIds[] = $l->id;
        }

        // 5. Non-IT Courses Data
        $coursesData = [
            [
                'title' => 'Mastering Italian Cuisine',
                'category_index' => 0,
                'level_index' => 0,
                'description' => 'Learn to cook authentic Italian dishes from scratch. Pasta, pizza, and classic desserts.',
                'price' => 35.00,
                'cross_price' => 70.00,
            ],
            [
                'title' => 'Complete Yoga and Meditation Journey',
                'category_index' => 1,
                'level_index' => 0,
                'description' => 'Improve your flexibility, strength, and mental clarity through guided daily yoga sessions.',
                'price' => 25.00,
                'cross_price' => 50.00,
            ],
            [
                'title' => 'Acoustic Guitar Masterclass',
                'category_index' => 2,
                'level_index' => 1,
                'description' => 'Go from beginner to advanced fingerpicking and chord progressions on the acoustic guitar.',
                'price' => 45.00,
                'cross_price' => 90.00,
            ],
            [
                'title' => 'Personal Finance & Investing 101',
                'category_index' => 3,
                'level_index' => 0,
                'description' => 'Learn how to manage your money, budget effectively, and build long-term wealth in the stock market.',
                'price' => 55.00,
                'cross_price' => 110.00,
            ]
        ];

        foreach ($coursesData as $index => $cData) {
            $course = Course::create([
                'title' => $cData['title'],
                'user_id' => $user->id,
                'category_id' => $catIds[$cData['category_index']],
                'level_id' => $levelIds[$cData['level_index']],
                'language_id' => null,
                'description' => $cData['description'],
                'price' => $cData['price'],
                'cross_price' => $cData['cross_price'],
                'status' => 1,
                'is_featured' => 'yes',
                'image' => null
            ]);

            // Add Chapters
            for ($i = 1; $i <= 3; $i++) {
                $chapter = chapter::create([
                    'title' => 'Phase ' . $i . ': ' . ($i == 1 ? 'Getting Started' : ($i == 2 ? 'Deepening Practice' : 'Mastery')),
                    'course_id' => $course->id,
                    'sort_order' => $i,
                    'status' => 1
                ]);

                // Add Lessons to Chapter
                for ($j = 1; $j <= 4; $j++) {
                    lesson::create([
                        'title' => 'Lesson ' . $j . ': ' . ['Introduction', 'Techniques', 'Practical Application', 'Review'][$j-1],
                        'chapter_id' => $chapter->id,
                        'is_free_preview' => ($i == 1 && $j == 1) ? 'yes' : 'no',
                        'duration' => rand(8, 30),
                        'video' => 'lessons/dummy.mp4',
                        'description' => 'In this exciting lesson, we will explore practical applications and exercises.',
                        'sort_order' => $j,
                        'status' => 1
                    ]);
                }
            }
        }
    }
}
