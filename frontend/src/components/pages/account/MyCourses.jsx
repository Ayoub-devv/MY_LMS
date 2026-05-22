import React, { useState, useEffect } from 'react'
import Layout from './../../common/Layout';
import { Link } from 'react-router-dom';
import UserSidebar from '../../common/UserSidebar';
import { apiUrl, fileUrl } from '../../common/config';
import { FaBriefcase, FaUsers, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
                const token = userInfo?.token || null;

                const res = await fetch(`${apiUrl}/courses`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });

                const result = await res.json();

                if (res.ok) {
                    setCourses(result);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const toggleStatus = async (courseId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                toast.success(result.message);
                setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: result.data.status } : c));
            } else {
                toast.error(result.message || 'Error toggling status');
            }
        } catch (error) {
            toast.error('Error toggling status');
        }
    };

    return (
        <Layout>
            <section className='section-4 bg-light min-vh-100'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0 text-primary'>My Courses</h2>
                                <Link to="/account/courses/create" className='btn btn-primary'>Create</Link>
                            </div>
                        </div>

                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>

                        <div className='col-lg-9'>
                            {loading ? (
                                <p className="text-muted">Loading...</p>
                            ) : courses.length === 0 ? (
                                <p className="text-muted">No courses yet.</p>
                            ) : (
                                <div className='row gy-4'>
                                    {courses.map((course) => (
                                        <div key={course.id} className='col-md-6 col-lg-4'>
                                            <div className='card border-0 shadow-sm h-100'>
                                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                                    {course.image ? (
                                                        <img 
                                                            src={course.image.startsWith('http') ? course.image : `${fileUrl}/storage/${course.image}`}
                                                            className='card-img-top w-100 h-100 object-fit-cover' 
                                                            alt={course.title}
                                                        />
                                                    ) : (
                                                        <div className='bg-light d-flex align-items-center justify-content-center h-100 w-100 text-muted'>
                                                            No Cover Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='card-body d-flex flex-column'>
                                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                                        <h5 className='card-title mb-0 fs-6 fw-bold flex-grow-1 text-primary'>{course.title}</h5>
                                                        <span className={`badge ${course.status == '1' ? 'soft-bg-success' : 'bg-light text-muted'}`} style={{ fontSize: '0.7rem' }}>
                                                            {course.status == '1' ? 'Published' : 'Draft'}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='d-flex justify-content-between mb-3 text-muted small'>
                                                        <div className="d-flex align-items-center">
                                                            <FaBriefcase className='me-2' /> 
                                                            {course.level ? course.level.name : 'All Levels'}
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <FaUsers className='me-2' /> 0
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <FaStar className='me-1 text-warning' /> 0.0
                                                        </div>
                                                    </div>

                                                    <div className='mt-auto border-top pt-3'>
                                                        <div className='d-flex align-items-center mb-3'>
                                                            <span className='fs-5 fw-bold text-primary'>${course.price || '0.00'}</span>
                                                            {course.cross_price && (
                                                                <span className='text-muted text-decoration-line-through ms-2 small'>
                                                                    ${course.cross_price}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className='d-grid gap-2'>
                                                            <button
                                                                className={`btn btn-sm w-100 ${course.status == '1' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                                                onClick={() => toggleStatus(course.id)}
                                                            >
                                                                {course.status == '1' ? 'Unpublish' : 'Publish'}
                                                            </button>
                                                            <Link to={`/account/courses/edit/${course.id}`} className='btn btn-sm btn-primary w-100'>Edit Course</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

export default MyCourses