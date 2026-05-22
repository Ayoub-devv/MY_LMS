<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\level;
use App\Models\Course;
use App\Models\chapter;
use App\Models\lesson;
use App\Models\User;

class DummyCoursesSeeder extends Seeder
{
    public function run()
    {
        // 1. Ensure we have an admin/user
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@lms.com',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]);
        }

        // 2. Categories
        $categories = ['Web Development', 'Data Science', 'Graphic Design', 'Digital Marketing'];
        $catIds = [];
        foreach ($categories as $cat) {
            $c = Category::firstOrCreate(['name' => $cat]);
            $catIds[] = $c->id;
        }

        // 3. Levels
        $levels = ['Beginner', 'Intermediate', 'Advanced'];
        $levelIds = [];
        foreach ($levels as $lvl) {
            $l = level::firstOrCreate(['name' => $lvl]);
            $levelIds[] = $l->id;
        }

        // 4. Dummy Courses Data
        $coursesData = [
            [
                'title' => 'Complete Modern React Developer',
                'category_index' => 0,
                'level_index' => 1,
                'description' => 'Learn React JS from scratch! Build modern web applications. This comprehensive course will guide you through all React concepts.',
                'price' => 49.99,
                'cross_price' => 99.99,
            ],
            [
                'title' => 'Python for Data Science and Machine Learning',
                'category_index' => 1,
                'level_index' => 0,
                'description' => 'A comprehensive guide to using Python for data analysis and ML. Perfect for beginners wanting to enter AI.',
                'price' => 59.99,
                'cross_price' => 120.00,
            ],
            [
                'title' => 'UI/UX Masterclass: Design Beautiful Interfaces',
                'category_index' => 2,
                'level_index' => 0,
                'description' => 'Master Figma and learn the principles of beautiful UI/UX design. Start creating pixel-perfect apps.',
                'price' => 39.99,
                'cross_price' => 79.99,
            ],
            [
                'title' => 'SEO & Digital Marketing Strategy',
                'category_index' => 3,
                'level_index' => 2,
                'description' => 'Learn how to rank #1 on Google and run successful ad campaigns across multiple social platforms.',
                'price' => 29.99,
                'cross_price' => 50.00,
            ]
        ];

        // Sample youtube videos ids
        $videos = [
            '8FjxbbGz2pU', // A random tech video
            'dGcsHMXbSOA',
            'PkZNo7MF68',
            'Ke90Tje7VS0'
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
                    'title' => 'Module ' . $i . ': ' . ($i == 1 ? 'Introduction' : ($i == 2 ? 'Core Concepts' : 'Advanced Topics')),
                    'course_id' => $course->id,
                    'sort_order' => $i,
                    'status' => 1
                ]);

                // Add Lessons to Chapter
                for ($j = 1; $j <= 4; $j++) {
                    lesson::create([
                        'title' => 'Lesson ' . $j . ': ' . ['Overview', 'Setting up the environment', 'Deep Dive', 'Summary'][$j-1],
                        'chapter_id' => $chapter->id,
                        'is_free_preview' => ($i == 1 && $j == 1) ? 'yes' : 'no',
                        'duration' => rand(5, 25),
                        'video' => 'https://www.youtube.com/watch?v=' . $videos[array_rand($videos)],
                        'description' => 'In this lesson we will cover the foundational concepts thoroughly.',
                        'sort_order' => $j,
                        'status' => 1
                    ]);
                }
            }
        }
    }
}
