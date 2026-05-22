import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom';
import Course from './../common/Course';
import Layout from './../common/Layout';
import { apiUrl } from '../common/config';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const Courses = () => {
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '');
    const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level_id') || '');
    const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language_id') || '');
    const [sort, setSort] = useState('0');

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [selectedCategory, selectedLevel, selectedLanguage, sort]);

    const fetchOptions = async () => {
        try {
            const res = await fetch(`${apiUrl}/public/course-options`);
            const result = await res.json();
            setCategories(result.categories || []);
            setLevels(result.levels || []);
            setLanguages(result.languages || []);
        } catch (error) {
            console.error('Failed to fetch options');
        }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (selectedCategory) params.append('category_id', selectedCategory);
            if (selectedLevel) params.append('level_id', selectedLevel);
            if (selectedLanguage) params.append('language_id', selectedLanguage);
            params.append('sort', sort);

            const res = await fetch(`${apiUrl}/public/courses?${params.toString()}`);
            const result = await res.json();
            setCourses(result.data || []);
        } catch (error) {
            console.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses();
    };

    const clearFilters = () => {
        setKeyword('');
        setSelectedCategory('');
        setSelectedLevel('');
        setSelectedLanguage('');
        setSort('0');
    };

    return (
        <Layout>
            <div className='bg-light py-4 border-bottom'>
                <div className='container'>
                    <h1 className="h3 fw-bolder mb-2">Explore All Courses</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Courses</li>
                        </ol>
                    </nav>
                </div>
            </div>
            
            <div className='container py-5'>
                <div className='row g-4'>
                    <div className='col-lg-3'>
                        <div className='card border-0 shadow-sm rounded-4 sticky-top' style={{ top: '100px', zIndex: 1 }}>
                            <div className='card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex align-items-center justify-content-between'>
                                <h5 className='fw-bold mb-0 d-flex align-items-center gap-2'>
                                    <Filter size={20} className="text-primary" />
                                    Filters
                                </h5>
                                {(selectedCategory || selectedLevel || selectedLanguage || keyword) && (
                                    <button 
                                        className='btn btn-link text-danger text-decoration-none p-0 d-flex align-items-center gap-1 small fw-medium' 
                                        onClick={clearFilters}
                                    >
                                        <X size={14} /> Clear
                                    </button>
                                )}
                            </div>
                            <div className='card-body p-4'>
                                <form onSubmit={handleSearch} className="mb-4">
                                    <div className="position-relative">
                                        <Search size={18} className="position-absolute text-muted" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)' }} />
                                        <input
                                            type="text"
                                            className='form-control bg-light border-0 rounded-pill ps-5 py-2 shadow-none'
                                            placeholder='Search courses...'
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                    </div>
                                </form>

                                {categories.length > 0 && (
                                    <div className='mb-4'>
                                        <h6 className='fw-bold mb-3 text-uppercase text-muted' style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Category</h6>
                                        <div className="d-flex flex-column gap-2">
                                            {categories.map(cat => (
                                                <div key={cat.id} className="form-check custom-radio">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="category"
                                                        id={`cat-${cat.id}`}
                                                        checked={selectedCategory === String(cat.id)}
                                                        onChange={() => setSelectedCategory(String(cat.id))}
                                                    />
                                                    <label className="form-check-label text-dark fw-medium" htmlFor={`cat-${cat.id}`}>
                                                        {cat.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {levels.length > 0 && (
                                    <div className='mb-4'>
                                        <h6 className='fw-bold mb-3 text-uppercase text-muted' style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Level</h6>
                                        <div className="d-flex flex-column gap-2">
                                            {levels.map(lvl => (
                                                <div key={lvl.id} className="form-check custom-radio">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="level"
                                                        id={`lvl-${lvl.id}`}
                                                        checked={selectedLevel === String(lvl.id)}
                                                        onChange={() => setSelectedLevel(String(lvl.id))}
                                                    />
                                                    <label className="form-check-label text-dark fw-medium" htmlFor={`lvl-${lvl.id}`}>
                                                        {lvl.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {languages.length > 0 && (
                                    <div className='mb-0'>
                                        <h6 className='fw-bold mb-3 text-uppercase text-muted' style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Language</h6>
                                        <div className="d-flex flex-column gap-2">
                                            {languages.map(lang => (
                                                <div key={lang.id} className="form-check custom-radio">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="language"
                                                        id={`lang-${lang.id}`}
                                                        checked={selectedLanguage === String(lang.id)}
                                                        onChange={() => setSelectedLanguage(String(lang.id))}
                                                    />
                                                    <label className="form-check-label text-dark fw-medium" htmlFor={`lang-${lang.id}`}>
                                                        {lang.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-9'>
                        <div className='d-flex justify-content-between mb-4 align-items-center bg-white p-3 rounded-4 shadow-sm border border-light'>
                            <div className='fw-medium text-muted'>
                                Showing <span className="text-dark fw-bold">{courses.length}</span> course{courses.length !== 1 ? 's' : ''}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted small fw-medium">Sort by:</span>
                                <select className='form-select form-select-sm border-0 bg-light rounded-pill px-3 shadow-none fw-medium' style={{ width: '140px' }} value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="0">Newest First</option>
                                    <option value="1">Oldest First</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="row g-4">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-muted fw-medium">Loading courses...</p>
                                </div>
                            ) : courses.length === 0 ? (
                                <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
                                    <Search size={48} className="text-muted mb-3 opacity-50" />
                                    <h4 className="fw-bold">No courses found</h4>
                                    <p className="text-muted">We couldn't find any courses matching your current filters.</p>
                                    <button className="btn btn-outline-primary rounded-pill px-4 mt-2" onClick={clearFilters}>
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                courses.map(course => (
                                    <Course
                                        key={course.id}
                                        course={course}
                                        customClasses="col-lg-4 col-md-6"
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Courses
