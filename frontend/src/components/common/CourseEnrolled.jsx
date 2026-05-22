import React from 'react'
import { Link } from 'react-router-dom';
import { fileUrl } from './config';
import { FaBriefcase, FaUsers, FaStar } from 'react-icons/fa';
import { ProgressBar } from 'react-bootstrap';

const CourseEnrolled = ({ course }) => {
    const progress = course.progress_percentage || 0;

    return (
        <div className="col-md-4">
            <div className='card border-0 shadow-sm h-100 course-card'>
                <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
                    {course.image ? (
                        <img
                            src={`${fileUrl}/storage/${course.image}`}
                            alt={course.title}
                            className='card-img-top'
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div className='bg-light d-flex align-items-center justify-content-center h-100 w-100 text-muted'>
                            No Cover Image
                        </div>
                    )}
                    {progress === 100 && (
                        <div className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 small fw-bold shadow-sm">
                            Completed
                        </div>
                    )}
                </div>
                <div className='card-body p-3'>
                    <div className="card-title fw-bold mb-2 text-dark" style={{ fontSize: '0.9rem', height: '2.5rem', overflow: 'hidden' }}>
                        {course.title}
                    </div>
                    
                    <div className="progress-section mb-3">
                        <div className="d-flex justify-content-between mb-1">
                            <small className="text-muted">Progress</small>
                            <small className="fw-bold text-dark">{progress}%</small>
                        </div>
                        <ProgressBar now={progress} variant={progress === 100 ? "success" : "primary"} style={{ height: '6px' }} />
                    </div>

                    <div className="meta d-flex py-1 text-muted small border-top pt-2">
                        <div className="d-flex align-items-center me-3">
                            <FaBriefcase className='me-1' size={12} />
                            <span>{course.level ? course.level.name : 'All Levels'}</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <FaStar className='me-1 text-warning' size={12} />
                            <span>0.0</span>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white border-0 pb-3">
                    <Link 
                        to={`/account/watch-course/${course.id}`} 
                        className={`btn btn-sm w-100 ${progress === 100 ? 'btn-outline-success' : 'btn-primary'}`}
                    >
                        {progress === 100 ? 'Review Course' : (progress > 0 ? 'Continue Watching' : 'Start Learning')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CourseEnrolled
