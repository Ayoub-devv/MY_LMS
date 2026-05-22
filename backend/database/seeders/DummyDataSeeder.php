<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Users
        $userId = DB::table('users')->insertGetId([
            'name' => 'Ayoub',
            'last_name' => 'Admin',
            'role' => 'admin',
            'email' => 'admin@lms.com',
            'password' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Categories
        $categories = ['Development', 'Business', 'Design', 'Marketing'];
        foreach ($categories as $cat) {
            DB::table('categories')->insert([
                'name' => $cat,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $catId = DB::table('categories')->first()->id;

        // Languages
        $languages = ['English', 'French', 'Arabic'];
        foreach ($languages as $lang) {
            DB::table('languages')->insert([
                'name' => $lang,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $langId = DB::table('languages')->first()->id;

        // Levels
        $levels = ['Beginner', 'Intermediate', 'Advanced'];
        foreach ($levels as $lvl) {
            DB::table('levels')->insert([
                'name' => $lvl,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $lvlId = DB::table('levels')->first()->id;

        // Courses
        for ($i = 1; $i <= 5; $i++) {
            $courseId = DB::table('courses')->insertGetId([
                'title' => "Modern Web Development Course $i",
                'user_id' => $userId,
                'category_id' => $catId,
                'level_id' => $lvlId,
                'language_id' => $langId,
                'description' => "This is a comprehensive description for course $i. Learn full-stack development from scratch including HTML, CSS, JavaScript, and Laravel.",
                'price' => 49.99 * $i,
                'cross_price' => 99.99 * $i,
                'status' => 1,
                'is_featured' => 'yes',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Chapters (The table named 'chapters' currently has 'course_id')
            for ($j = 1; $j <= 3; $j++) {
                $chapterId = DB::table('chapters')->insertGetId([
                    'course_id' => $courseId,
                    'title' => "Chapter $j: Getting Started",
                    'sort_order' => $j,
                    'status' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Lessons (The table named 'lessons' currently has 'chapter_id')
                for ($k = 1; $k <= 2; $k++) {
                    DB::table('lessons')->insert([
                        'chapter_id' => $chapterId,
                        'title' => "Lesson $k: Introduction to Topic",
                        'is_free_preview' => $k == 1 ? 'yes' : 'no',
                        'duration' => 600, // 10 minutes
                        'video' => 'intro.mp4',
                        'description' => "Content for lesson $k in chapter $j.",
                        'sort_order' => $k,
                        'status' => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
