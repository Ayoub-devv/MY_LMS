import React, { useState, useEffect } from 'react'
import { Container, Nav, Navbar, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Search, BookOpen, UserCircle, Menu, Moon, Sun } from 'lucide-react'

const Header = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    
    // Theme state
    const [theme, setTheme] = useState(localStorage.getItem('lms_theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lms_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/courses?keyword=${keyword}`);
        } else {
            navigate('/courses');
        }
    };

    return (
        <Navbar expand="lg" className="bg-white shadow-sm header py-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white p-2 rounded-lg d-flex align-items-center justify-content-center" style={{ borderRadius: '8px' }}>
                        <BookOpen size={24} color={theme === 'dark' ? '#000' : '#fff'} />
                    </div>
                    <strong>Smart Learning</strong>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" className="border-0">
                    <Menu size={28} className="text-primary" />
                </Navbar.Toggle>
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                        <Nav.Link as={Link} to="/courses" className="fw-semibold px-lg-3 text-primary">All Courses</Nav.Link>
                    </Nav>
                    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                        <Form className="d-flex" onSubmit={handleSearch}>
                            <div className="custom-search-box bg-light rounded-pill px-3 py-1 d-flex align-items-center border w-100">
                                <Search size={18} className="text-muted" />
                                <input 
                                    type="text" 
                                    className="form-control border-0 bg-transparent shadow-none text-primary"
                                    placeholder="Search course here" 
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                        </Form>
                        <div className="d-flex align-items-center gap-2">
                            <button 
                                onClick={toggleTheme} 
                                className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center text-primary"
                                style={{ width: '40px', height: '40px', borderColor: 'var(--border-light)' }}
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                            <Link to='/account/dashboard' className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center gap-2 shadow-sm">
                                <UserCircle size={20} color={theme === 'dark' ? '#000' : '#fff'} />
                                <span>My Account</span>
                            </Link>
                        </div>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header
