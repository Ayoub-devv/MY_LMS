import React, { useState, useEffect } from 'react'
import Layout from '../../common/Layout'
import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaCheckCircle } from 'react-icons/fa';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl, fileUrl } from '../../common/config';
import { toast } from 'react-toastify';
import CourseReview from './CourseReview';

const WatchCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        fetchCourse();
        fetchProgress();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`${apiUrl}/public/courses/${id}`);
            const result = await res.json();
            if (res.ok && result.data) {
                setCourse(result.data);
                const chapters = result.data.chapters || [];
                for (const ch of chapters) {
                    if (ch.lessons && ch.lessons.length > 0) {
                        setActiveLesson(ch.lessons[0]);
                        break;
                    }
                }
            } else {
                toast.error('Course not found');
                navigate('/account/my-learning');
            }
        } catch (error) {
            toast.error('Error loading course');
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token;
        if (!token) return;

        try {
            const res = await fetch(`${apiUrl}/course-progress/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setProgress(result.percentage || 0);
                setCompletedLessons(result.completed_lessons || []);
            }
        } catch (error) {
            console.error('Error fetching progress');
        }
    };

    const handleMarkComplete = async () => {
        if (!activeLesson) return;
        
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token;

        try {
            const res = await fetch(`${apiUrl}/lesson-complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    lesson_id: activeLesson.id,
                    course_id: id
                })
            });

            if (res.ok) {
                toast.success('Progress saved');
                fetchProgress(); // Refresh progress stats
            }
        } catch (error) {
            toast.error('Error saving progress');
        }
    };

    const totalLessons = course?.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0;

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
            <section className='section-5 my-5'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8'>
                            {/* Video Player */}
                            <div className='video mb-3 shadow-lg bg-dark rounded'>
                                {activeLesson?.video ? (
                                    activeLesson.video.includes('youtube.com') || activeLesson.video.includes('youtu.be') ? (
                                        <iframe 
                                            key={activeLesson.id}
                                            width="100%" 
                                            height="450" 
                                            src={`https://www.youtube.com/embed/${activeLesson.video.split('v=')[1]?.split('&')[0] || activeLesson.video.split('youtu.be/')[1]}`}
                                            title="YouTube video player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                            style={{ backgroundColor: '#000', borderRadius: '8px' }}
                                        ></iframe>
                                    ) : (
                                        <video
                                            key={activeLesson.id}
                                            width="100%"
                                            height="450"
                                            controls
                                            autoPlay
                                            style={{ backgroundColor: '#000', borderRadius: '8px' }}
                                        >
                                            <source src={`${fileUrl}/storage/${activeLesson.video}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )
                                ) : (
                                    <div
                                        className="d-flex align-items-center justify-content-center text-white"
                                        style={{ height: '450px' }}
                                    >
                                        <div className="text-center">
                                            <MdSlowMotionVideo size={60} className="mb-3 opacity-50" />
                                            <p className="mb-0">
                                                {activeLesson ? 'No video uploaded for this lesson' : 'Select a lesson to start watching'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mark as Complete & Meta */}
                            <div className='meta-content p-4 bg-white rounded shadow-sm border'>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h3 className='mb-0 fw-bold'>{activeLesson?.title || 'Select a lesson'}</h3>
                                    {activeLesson && (
                                        <button 
                                            className={`btn ${completedLessons.includes(activeLesson.id) ? 'btn-success' : 'btn-outline-primary'}`}
                                            onClick={handleMarkComplete}
                                            disabled={completedLessons.includes(activeLesson.id)}
                                        >
                                            {completedLessons.includes(activeLesson.id) ? (
                                                <><FaCheckCircle className="me-2" /> Completed</>
                                            ) : (
                                                'Mark as Complete'
                                            )}
                                        </button>
                                    )}
                                </div>
                                {activeLesson?.description && (
                                    <div className="text-muted" dangerouslySetInnerHTML={{ __html: activeLesson.description }} />
                                )}
                            </div>

                            {/* Course Review Section */}
                            <CourseReview courseId={id} />
                        </div>

                        {/* Sidebar - Course Structure */}
                        <div className='col-md-4'>
                            <div className='card rounded shadow-sm border-0'>
                                <div className='card-body p-4'>
                                    <div className='h6 fw-bold mb-3'>
                                        {course.title}
                                    </div>
                                    <div className='mb-4'>
                                        <div className="d-flex justify-content-between mb-1">
                                            <small className="text-muted">Your Progress</small>
                                            <small className="fw-bold">{progress}%</small>
                                        </div>
                                        <ProgressBar now={progress} variant="success" style={{ height: '10px' }} />
                                    </div>

                                    <Accordion defaultActiveKey="0" flush id="courseWatchAccordion">
                                        {course.chapters?.map((chapter, idx) => (
                                            <Accordion.Item key={chapter.id} eventKey={String(idx)}>
                                                <Accordion.Header className="fw-medium">{chapter.title}</Accordion.Header>
                                                <Accordion.Body className='pt-2 pb-0 ps-0 pe-0'>
                                                    <ul className='lessons mb-0 list-unstyled'>
                                                        {chapter.lessons?.map(lesson => {
                                                            const isCompleted = completedLessons.includes(lesson.id);
                                                            const isActive = activeLesson?.id === lesson.id;
                                                            return (
                                                                <li
                                                                    key={lesson.id}
                                                                    className={`px-3 py-3 d-flex align-items-center justify-content-between border-bottom lesson-item ${isActive ? 'bg-light fw-bold' : ''}`}
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => setActiveLesson(lesson)}
                                                                >
                                                                    <div className="d-flex align-items-center">
                                                                        <MdSlowMotionVideo 
                                                                            size={18} 
                                                                            className={`me-2 ${isActive ? 'text-primary' : 'text-muted'}`} 
                                                                        />
                                                                        <span className={`${isActive ? 'text-primary' : 'text-dark'}`}>{lesson.title}</span>
                                                                    </div>
                                                                    {isCompleted && (
                                                                        <IoMdCheckmarkCircleOutline className="text-success" size={20} />
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default WatchCourse
