import React, { useState, useEffect } from 'react'
import UserSidebar from '../../common/UserSidebar';
import CourseEnrolled from '../../common/CourseEnrolled';
import Layout from '../../common/Layout';
import { apiUrl } from '../../common/config';

const MyLearning = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
            const token = userInfo?.token || null;

            try {
                const res = await fetch(`${apiUrl}/my-enrollments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                const result = await res.json();
                if (res.ok) {
                    setCourses(result.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch enrollments');
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='d-flex justify-content-between mt-5 mb-3'>
                            <h2 className='h4 mb-0 pb-0'>My Learning</h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : courses.length === 0 ? (
                                <p className="text-muted">You haven't enrolled in any courses yet.</p>
                            ) : (
                                <div className='row gy-4'>
                                    {courses.map(course => (
                                        <CourseEnrolled key={course.id} course={course} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default MyLearning
