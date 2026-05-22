<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Drop foreign keys using default names
        Schema::table('chapters', function (Blueprint $table) {
            $table->dropForeign('chapters_chapter_id_foreign');
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropForeign('lessons_course_id_foreign');
        });

        // 2. Rename tables
        Schema::rename('chapters', 'temp_lessons');
        Schema::rename('lessons', 'chapters');
        Schema::rename('temp_lessons', 'lessons');

        // 3. Re-add foreign keys with correct new names
        Schema::table('chapters', function (Blueprint $table) {
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->foreign('chapter_id')->references('id')->on('chapters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Drop foreign keys
        Schema::table('chapters', function (Blueprint $table) {
            $table->dropForeign('chapters_course_id_foreign');
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropForeign('lessons_chapter_id_foreign');
        });

        // 2. Rename tables back
        Schema::rename('lessons', 'temp_chapters');
        Schema::rename('chapters', 'lessons');
        Schema::rename('temp_chapters', 'chapters');

        // 3. Re-add foreign keys
        Schema::table('chapters', function (Blueprint $table) {
            $table->foreign('chapter_id')->references('id')->on('chapters')->onDelete('cascade');
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }
};
