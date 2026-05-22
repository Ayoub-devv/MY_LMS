import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import Layout from '../common/Layout';
import { apiUrl, fileUrl } from '../common/config';
import { toast } from 'react-toastify';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        fetchCourse();
        checkEnrollment();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`${apiUrl}/public/courses/${id}`);
            const result = await res.json();
            if (res.ok) {
                setCourse(result.data);
            } else {
                toast.error('Course not found');
                navigate('/courses');
            }
        } catch (error) {
            toast.error('Error loading course');
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollment = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token;
        if (!token) return;

        try {
            const res = await fetch(`${apiUrl}/enrollment/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setEnrolled(result.enrolled);
            }
        } catch (error) {
            // Not logged in or error, ignore
        }
    };

    const handleEnroll = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token;
        if (!token) {
            toast.info('Please login to enroll');
            navigate('/account/login');
            return;
        }

        setEnrolling(true);
        try {
            const res = await fetch(`${apiUrl}/enroll/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                toast.success('Enrolled successfully!');
                setEnrolled(true);
            } else {
                toast.error(result.message || 'Enrollment failed');
            }
        } catch (error) {
            toast.error('Error enrolling');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className='container py-5 text-center'>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!course) return null;

    return (
        <Layout>
            <div className='container pb-5 pt-3'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href="/courses">Courses</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{course.title}</li>
                    </ol>
                </nav>
                <div className='row my-5'>
                    <div className='col-lg-8'>
                        <h2>{course.title}</h2>
                        <div className='d-flex'>
                            {course.category && (
                                <div className='mt-1'>
                                    <span className="badge bg-green">{course.category.name}</span>
                                </div>
                            )}
                            <div className='d-flex ps-3'>
                                <div className="text pe-2 pt-1">0.0</div>
                                <Rating initialValue={0} size={20} readonly />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col">
                                <span className="text-muted d-block">Level</span>
                                <span className="fw-bold">{course.level ? course.level.name : 'All Levels'}</span>
                            </div>
                            <div className="col">
                                <span className="text-muted d-block">Students</span>
                                <span className="fw-bold">{course.enrollments_count || 0}</span>
                            </div>
                            <div className="col">
                                <span className="text-muted d-block">Language</span>
                                <span className="fw-bold">{course.language ? course.language.name : 'N/A'}</span>
                            </div>
                        </div>

                        {/* Overview */}
                        {course.description && (
                            <div className='col-md-12 mt-4'>
                                <div className='border bg-white rounded-3 p-4'>
                                    <h3 className='mb-3 h4'>Overview</h3>
                                    <div dangerouslySetInnerHTML={{ __html: course.description }} />
                                </div>
                            </div>
                        )}

                        {/* Outcomes */}
                        {course.outcomes && course.outcomes.length > 0 && (
                            <div className='col-md-12 mt-4'>
                                <div className='border bg-white rounded-3 p-4'>
                                    <h3 className='mb-3 h4'>What you will learn</h3>
                                    <ul className="list-unstyled mt-3">
                                        {course.outcomes.map(outcome => (
                                            <li key={outcome.id} className="d-flex align-items-center mb-2">
                                                <span className="text-success me-2">&#10003;</span>
                                                <span>{outcome.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Requirements */}
                        {course.requirements && course.requirements.length > 0 && (
                            <div className='col-md-12 mt-4'>
                                <div className='border bg-white rounded-3 p-4'>
                                    <h3 className='mb-3 h4'>Requirements</h3>
                                    <ul className="list-unstyled mt-3">
                                        {course.requirements.map(req => (
                                            <li key={req.id} className="d-flex align-items-center mb-2">
                                                <span className="text-success me-2">&#10003;</span>
                                                <span>{req.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Course Structure */}
                        {course.chapters && course.chapters.length > 0 && (
                            <div className='col-md-12 mt-4'>
                                <div className='border bg-white rounded-3 p-4'>
                                    <h3 className="h4 mb-3">Course Structure</h3>
                                    <Accordion defaultActiveKey="0" id="courseAccordion">
                                        {course.chapters.map((chapter, index) => (
                                            <Accordion.Item key={chapter.id} eventKey={String(index)}>
                                                <Accordion.Header>
                                                    {chapter.title}
                                                    <span className="ms-3 text-muted">
                                                        ({chapter.lessons ? chapter.lessons.length : 0} lesson{chapter.lessons && chapter.lessons.length !== 1 ? 's' : ''})
                                                    </span>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <ListGroup>
                                                        {chapter.lessons && chapter.lessons.map(lesson => (
                                                            <ListGroup.Item key={lesson.id} className="d-flex justify-content-between align-items-center">
                                                                <span className="text-dark">{lesson.title}</span>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    {lesson.is_free_preview === 'yes' && (
                                                                        <Badge bg="primary">Preview</Badge>
                                                                    )}
                                                                    {lesson.duration && (
                                                                        <span className="text-muted">{lesson.duration} min</span>
                                                                    )}
                                                                </div>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className='col-lg-4'>
                        <div className='border rounded-3 bg-white p-4 shadow-sm'>
                            {course.image && (
                                <img
                                    src={`${fileUrl}/storage/${course.image}`}
                                    alt={course.title}
                                    className="w-100 rounded mb-3"
                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <Card.Body>
                                <h3 className="fw-bold">${course.price || '0.00'}</h3>
                                {course.cross_price && (
                                    <div className="text-muted text-decoration-line-through">${course.cross_price}</div>
                                )}
                                <div className="mt-4">
                                    {enrolled ? (
                                        <button className="btn btn-success w-100" disabled>
                                            ✓ Already Enrolled
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={handleEnroll}
                                            disabled={enrolling}
                                        >
                                            {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                        </button>
                                    )}
                                </div>
                            </Card.Body>
                            <Card.Footer className='mt-4'>
                                <h6 className="fw-bold">This course includes</h6>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className='ps-0'>
                                        <i className="bi bi-infinity text-primary me-2"></i>
                                        Full lifetime access
                                    </ListGroup.Item>
                                    <ListGroup.Item className='ps-0'>
                                        <i className="bi bi-tv text-primary me-2"></i>
                                        Access on mobile and TV
                                    </ListGroup.Item>
                                    <ListGroup.Item className='ps-0'>
                                        <i className="bi bi-award-fill text-primary me-2"></i>
                                        Certificate of completion
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Footer>
                            {course.user && (
                                <div className="mt-4 pt-3 border-top">
                                    <h6 className="fw-bold">Instructor</h6>
                                    <p className="mb-0">{course.user.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Detail
