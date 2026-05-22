import React, { useState, useEffect } from 'react'
import Course from './Course'
import { apiUrl } from './config';
import { Sparkles } from 'lucide-react'

const FeaturedCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${apiUrl}/public/courses?sort=0`);
                const result = await res.json();
                if (res.ok) {
                    // Show up to 8 newest published courses
                    setCourses((result.data || []).slice(0, 8));
                }
            } catch (error) {
                console.error('Failed to fetch featured courses');
            }
        };
        fetchCourses();
    }, []);

    return (
        <section className='section-3 py-5 bg-light'>
            <div className="container py-4">
                <div className='section-title mb-5 d-flex flex-column align-items-center text-center'>
                    <div className="d-inline-flex align-items-center gap-2 badge badge-soft-warning mb-3 px-3 py-2 rounded-pill">
                        <Sparkles size={16} />
                        <span className="fw-semibold">Trending Now</span>
                    </div>
                    <h2 className='h2 fw-bolder mb-3'>Featured Courses</h2>
                    <p className="text-muted lead max-w-2xl">Hand-picked premium courses to help you accelerate your career and master new skills.</p>
                </div>
                <div className="row g-4 justify-content-center">
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <Course
                                key={course.id}
                                course={course}
                                customClasses="col-lg-3 col-md-6"
                            />
                        ))
                    ) : (
                        <p className="text-muted text-center py-5">No courses available yet.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default FeaturedCourses
