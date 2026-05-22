import React from 'react'
import { Link } from 'react-router-dom';
import { fileUrl } from './config';
import { BookOpen, Users, Star } from 'lucide-react';

const Course = ({ course, customClasses }) => {
    return (
        <div className={customClasses}>
            <Link to={`/detail/${course.id}`} className="text-decoration-none">
                <div className='card border-0 shadow-sm h-100 transition-all hover-lift d-flex flex-column'>
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                        {course.image ? (
                            <img
                                src={course.image.startsWith('http') ? course.image : `${fileUrl}/storage/${course.image}`}
                                alt={course.title}
                                className='w-100 h-100 object-fit-cover transition-all duration-500'
                                style={{ transform: 'scale(1)' }}
                            />
                        ) : (
                            <div className='bg-light d-flex flex-column align-items-center justify-content-center h-100 w-100 text-muted'>
                                <BookOpen size={48} className="mb-2 opacity-50" />
                                <span className="fw-semibold">Smart Learning</span>
                            </div>
                        )}
                        <div className="position-absolute top-0 m-3 z-1">
                            {course.category && (
                                <span className="badge badge-soft-primary shadow-sm px-2 py-1">{course.category.name}</span>
                            )}
                        </div>
                    </div>
                    <div className='card-body p-4 d-flex flex-column flex-grow-1'>
                        <h5 className="card-title fw-bold mb-3 text-primary line-clamp-2" style={{ fontSize: '1.1rem', minHeight: '3.2rem' }}>
                            {course.title}
                        </h5>
                        <div className="d-flex flex-wrap gap-3 mt-auto pt-3 border-top border-light text-muted small fw-medium">
                            <div className="d-flex align-items-center">
                                <BookOpen size={16} className='me-2 text-primary' />
                                <span>{course.level ? course.level.name : 'All Levels'}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <Users size={16} className='me-2 text-primary' />
                                <span>{course.enrollments_count || 0} Students</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <Star size={16} className='me-2 text-warning' style={{ fill: 'currentColor' }} />
                                <span>5.0</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
                        <div className="d-flex justify-content-between align-items-center border border-light rounded-pill p-1 pe-3 bg-light">
                            <div className="bg-white border border-light rounded-pill px-3 py-1 shadow-sm">
                                <span className='fw-bold text-primary'>${course.price || '0.00'}</span>
                            </div>
                            {course.cross_price && (
                                <span className='text-muted text-decoration-line-through small fw-medium'>
                                    ${course.cross_price}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Course
