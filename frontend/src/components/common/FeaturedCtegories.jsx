import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from './config'
import { Compass, ArrowRight } from 'lucide-react'

const FeaturedCtegories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${apiUrl}/public/course-options`);
                const result = await res.json();
                if (res.ok) {
                    setCategories(result.categories || []);
                }
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    return (
        <section className='section-2 py-5'>
            <div className="container py-4">
                <div className='section-title mb-5 text-center'>
                    <div className="d-inline-flex align-items-center gap-2 badge badge-soft-primary mb-3 px-3 py-2 rounded-pill">
                        <Compass size={16} />
                        <span className="fw-semibold">Categories</span>
                    </div>
                    <h2 className='h2 fw-bolder mb-3'>Explore Top Categories</h2>
                    <p className="text-muted lead max-w-2xl mx-auto">Discover programs designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className='row g-4 justify-content-center'>
                    {categories.length > 0 ? (
                        categories.slice(0, 4).map(category => (
                            <div key={category.id} className='col-sm-6 col-md-4 col-lg-3' >
                                <Link 
                                    to={`/courses?category_id=${category.id}`} 
                                    className="text-decoration-none d-block h-100"
                                >
                                    <div className='card h-100 border-0 shadow-sm transition-all hover-lift' style={{ background: 'linear-gradient(145deg, var(--bg-white), var(--bg-main))' }}>
                                        <div className='card-body p-4 d-flex flex-column align-items-center text-center justify-content-center gap-3'>
                                            <div className="badge-soft-primary p-3 rounded-circle mb-2 d-flex align-items-center justify-content-center">
                                                <Compass size={32} />
                                            </div>
                                            <h5 className="fw-bold text-dark mb-0">{category.name}</h5>
                                            <div className="d-flex align-items-center text-primary mt-auto fw-semibold" style={{ fontSize: '0.9rem' }}>
                                                <span>Explore</span>
                                                <ArrowRight size={16} className="ms-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center">No categories found.</p>
                    )}
                </div>
                {categories.length > 4 && (
                    <div className="text-center mt-5">
                        <Link to="/courses" className="btn btn-outline-primary btn-lg fw-bold px-5 py-3 rounded-pill transition-all hover-lift d-inline-flex align-items-center gap-2">
                            Explore All Categories <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

export default FeaturedCtegories
