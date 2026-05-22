<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CourseController extends Controller
{
    // Public: list published courses with filters
    public function publicIndex(Request $request) {
        $query = Course::with(['level', 'category', 'language'])
            ->withCount('enrollments')
            ->where('status', '1');

        if ($request->has('keyword') && $request->keyword) {
            $query->where('title', 'like', '%' . $request->keyword . '%');
        }
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('level_id') && $request->level_id) {
            $query->where('level_id', $request->level_id);
        }
        if ($request->has('language_id') && $request->language_id) {
            $query->where('language_id', $request->language_id);
        }

        $sort = $request->input('sort', '0');
        if ($sort === '1') {
            $query->orderBy('created_at', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $courses = $query->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ], 200);
    }

    // Public: full course detail
    public function publicShow($id) {
        $course = Course::with([
            'level', 'category', 'language', 'user',
            'outcomes' => function($q) { $q->orderBy('sort_order'); },
            'requirements' => function($q) { $q->orderBy('sort_order'); },
            'chapters' => function($q) { $q->orderBy('sort_order'); },
            'chapters.lessons' => function($q) { $q->orderBy('sort_order'); }
        ])
        ->withCount('enrollments')
        ->where('status', '1')
        ->find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }

    // Public: get filter options
    public function publicOptions() {
        $categories = \App\Models\Category::all();
        $levels = \App\Models\level::all();
        $languages = \App\Models\language::all();

        return response()->json([
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ]);
    }

    // Dashboard stats for the logged-in instructor
    public function dashboardStats(Request $request) {
        $userId = $request->user()->id;
        
        $totalCourses = Course::where('user_id', $userId)->count();
        $activeCourses = Course::where('user_id', $userId)->where('status', '1')->count();
        
        // Count total enrollments across all instructor's courses
        $courseIds = Course::where('user_id', $userId)->pluck('id');
        $totalEnrollments = \App\Models\enrollment::whereIn('course_id', $courseIds)->count();
        
        // Calculate total revenue
        $totalRevenue = 0;
        $courses = Course::where('user_id', $userId)->get();
        foreach ($courses as $course) {
            $enrollCount = \App\Models\enrollment::where('course_id', $course->id)->count();
            $totalRevenue += ($course->price ?? 0) * $enrollCount;
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'total_courses' => $totalCourses,
                'active_courses' => $activeCourses,
                'total_enrollments' => $totalEnrollments,
                'total_revenue' => number_format($totalRevenue, 2),
            ]
        ], 200);
    }

    public function index() {
        $courses = Course::with('level')->where('user_id', request()->user()->id)->get();
        return response()->json($courses);
    }

    public function options() {
        $categories = \App\Models\Category::all();
        $levels = \App\Models\level::all();
        $languages = \App\Models\language::all();

        return response()->json([
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ]);
    }

    // Store a new course as a draft
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $course = new Course();
        $course->title = $request->title;
        $course->status = '0';
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course created successfully',
            'data' => $course,
        ], 200);
    }

    // Return a single course by ID
    public function show($id) {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }

    // Update an existing course
    public function update(Request $request, $id) {
    $course = Course::find($id);

    if (!$course) {
        return response()->json([
            'status' => 404,
            'message' => 'Course not found',
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'title'       => 'sometimes|required|min:5',
        'category_id' => 'sometimes|nullable|integer|exists:categories,id',
        'level_id'    => 'sometimes|nullable|integer|exists:levels,id',
        'language_id' => 'sometimes|nullable|integer|exists:languages,id',
        'description' => 'sometimes|nullable|string',
        'price'       => 'sometimes|nullable|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 400,
            'errors' => $validator->errors(),
        ], 400);
    }

    if ($request->has('title'))       $course->title       = $request->title;
    if ($request->has('category_id')) $course->category_id = $request->category_id;
    if ($request->has('level_id'))    $course->level_id    = $request->level_id;
    if ($request->has('language_id')) $course->language_id = $request->language_id;
    if ($request->has('description')) $course->description = $request->description;
    if ($request->has('price'))       $course->price       = (float) $request->price;

    $course->save();

    return response()->json([
        'status' => 200,
        'message' => 'Course updated successfully',
        'data' => $course,
    ], 200);
    }

    // Update the course cover image
    public function updateImage(Request $request, $id) {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        if ($request->hasFile('image')) {
            // Delete old image from Cloudinary if it exists
            if ($course->image && str_starts_with($course->image, 'http')) {
                // Extract public_id from URL and delete
                $publicId = pathinfo(parse_url($course->image, PHP_URL_PATH), PATHINFO_FILENAME);
                try { Cloudinary::destroy('lms/courses/' . $publicId); } catch(\Exception $e) {}
            } elseif ($course->image) {
                Storage::disk('public')->delete($course->image);
            }

            // Upload to Cloudinary
            $uploaded = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'lms/courses',
                'transformation' => ['width' => 800, 'height' => 500, 'crop' => 'fill', 'quality' => 'auto']
            ]);
            $url = $uploaded->getSecurePath();
            $course->image = $url;
            $course->save();

            return response()->json([
                'status' => 200,
                'message' => 'Image updated successfully',
                'image_url' => $url
            ], 200);
        }

        return response()->json([
            'status' => 400,
            'message' => 'No image provided',
        ], 400);
    }

    // Toggle publish/unpublish
    public function toggleStatus($id) {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        $course->status = $course->status == '1' ? '0' : '1';
        $course->save();

        $statusText = $course->status == '1' ? 'published' : 'unpublished';

        return response()->json([
            'status' => 200,
            'message' => "Course {$statusText} successfully",
            'data' => $course,
        ], 200);
    }
}