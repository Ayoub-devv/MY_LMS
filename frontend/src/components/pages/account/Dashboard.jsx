import React, { useState, useEffect } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import UserSidebar from '../../common/UserSidebar'
import { apiUrl } from '../../common/config'
import { BookOpen, Users, DollarSign, Award, GraduationCap, LayoutDashboard } from 'lucide-react'

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [studentStats, setStudentStats] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    const isAdmin = userInfo.role === 'admin';

    useEffect(() => {
        const token = userInfo?.token || null;
        if (!token) return;

        const fetchData = async () => {
            try {
                if (isAdmin) {
                    const res = await fetch(`${apiUrl}/dashboard-stats`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        }
                    });
                    const result = await res.json();
                    if (res.ok) setStats(result.data);
                } else {
                    const res = await fetch(`${apiUrl}/my-enrollments`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        }
                    });
                    const result = await res.json();
                    if (res.ok) {
                        setStudentStats({
                            total_enrolled: result.data?.length || 0,
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data');
            }
        };
        fetchData();
    }, [isAdmin, userInfo.token]);

    return (
        <Layout>
            <section className='section-4 bg-light min-vh-100'>
                <div className='container pb-5 pt-4'>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className='h3 fw-bolder mb-1 d-flex align-items-center gap-2'>
                                <LayoutDashboard className="text-primary" size={28} />
                                {isAdmin ? 'Instructor Dashboard' : 'Student Dashboard'}
                            </h2>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    
                    <div className='row g-4'>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            {!isAdmin && (
                                <div className="mb-4">
                                    <div className="card border-0 shadow-sm overflow-hidden" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)' }}>
                                        <div className="card-body p-4 p-lg-5 text-white position-relative">
                                            <div className="position-relative z-1">
                                                <h3 className="fw-bolder mb-3 text-white">Welcome back, {userInfo.name}! 👋</h3>
                                                <p className="lead mb-4 opacity-75 max-w-2xl">This is your learning hub. Track your progress, view your certificates, and pick up right where you left off.</p>
                                                <div className="d-flex flex-wrap gap-3">
                                                    <Link to="/courses" className="btn btn-light fw-bold px-4">Browse Courses</Link>
                                                    <Link to="/account/my-learning" className="btn btn-outline-light fw-bold px-4">Continue Learning</Link>
                                                </div>
                                            </div>
                                            <GraduationCap size={200} className="position-absolute opacity-10" style={{ right: '-20px', bottom: '-40px', transform: 'rotate(-15deg)' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className='row g-4'>
                                {isAdmin ? (
                                    <>
                                        <div className='col-md-4'>
                                            <div className='card dashboard-stat-card shadow-sm h-100'>
                                                <div className='card-body p-4 d-flex flex-column justify-content-center'>
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <span className="stat-label text-muted fw-bold">Revenue</span>
                                                        <div className="soft-bg-success p-2 rounded-lg">
                                                            <DollarSign size={24} />
                                                        </div>
                                                    </div>
                                                    <div className="stat-value text-success fs-3 fw-bold">${stats?.total_revenue || '0.00'}</div>
                                                    <div className='mt-auto pt-3 border-top mt-3'>
                                                        <small className="text-muted fw-medium">Total earnings from enrollments</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='card dashboard-stat-card shadow-sm h-100' style={{ borderLeftColor: '#8B5CF6' }}>
                                                <div className='card-body p-4 d-flex flex-column justify-content-center'>
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <span className="stat-label text-muted fw-bold">Enrolled Students</span>
                                                        <div className="soft-bg-primary p-2 rounded-lg">
                                                            <Users size={24} />
                                                        </div>
                                                    </div>
                                                    <div className="stat-value text-primary fs-3 fw-bold">{stats?.total_enrollments || 0}</div>
                                                    <div className='mt-auto pt-3 border-top mt-3'>
                                                        <small className="text-muted fw-medium">Students across all courses</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='card dashboard-stat-card shadow-sm h-100' style={{ borderLeftColor: '#F59E0B' }}>
                                                <div className='card-body p-4 d-flex flex-column justify-content-center'>
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <span className="stat-label text-muted fw-bold">Active Courses</span>
                                                        <div className="soft-bg-warning p-2 rounded-lg">
                                                            <BookOpen size={24} />
                                                        </div>
                                                    </div>
                                                    <div className="stat-value text-warning fs-3 fw-bold">
                                                        {stats?.active_courses || 0} <span className="text-muted fs-5 fw-medium">/ {stats?.total_courses || 0}</span>
                                                    </div>
                                                    <div className='mt-auto pt-3 border-top mt-3'>
                                                        <Link to="/account/my-courses" className="text-decoration-none text-warning fw-bold d-inline-flex align-items-center">
                                                            Manage Courses
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='col-md-6'>
                                            <div className='card dashboard-stat-card shadow-sm h-100'>
                                                <div className='card-body p-4'>
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <span className="stat-label text-muted fw-bold">Enrolled Courses</span>
                                                        <div className="soft-bg-primary p-2 rounded-lg">
                                                            <BookOpen size={24} />
                                                        </div>
                                                    </div>
                                                    <div className="stat-value text-primary fs-3 fw-bold">{studentStats?.total_enrolled || 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className='card dashboard-stat-card shadow-sm h-100' style={{ borderLeftColor: '#10B981' }}>
                                                <div className='card-body p-4'>
                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                        <span className="stat-label text-muted fw-bold">Certificates Earned</span>
                                                        <div className="soft-bg-success p-2 rounded-lg">
                                                            <Award size={24} />
                                                        </div>
                                                    </div>
                                                    <div className="stat-value text-success fs-3 fw-bold">0</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-transparent border-bottom p-4">
                                        <h5 className="fw-bold mb-0 text-primary">Recent Activity</h5>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0 align-middle">
                                                <thead className="table-light text-muted small">
                                                    <tr>
                                                        <th className="px-4 py-3 border-bottom-0">Activity</th>
                                                        <th className="px-4 py-3 border-bottom-0">Date</th>
                                                        <th className="px-4 py-3 border-bottom-0 text-end">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="px-4 py-3">
                                                            <div className="fw-medium text-primary">Welcome to Smart Learning</div>
                                                            <div className="text-muted small">Account created successfully</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-muted">Just now</td>
                                                        <td className="px-4 py-3 text-end">
                                                            <span className="badge soft-bg-success rounded-pill px-3 py-2">Completed</span>
                                                        </td>
                                                    </tr>
                                                    {!isAdmin && (
                                                        <tr>
                                                            <td className="px-4 py-3">
                                                                <div className="fw-medium text-primary">Explore Courses</div>
                                                                <div className="text-muted small">Start your learning journey by browsing our catalog.</div>
                                                            </td>
                                                            <td className="px-4 py-3 text-muted">Pending</td>
                                                            <td className="px-4 py-3 text-end">
                                                                <Link to="/courses" className="btn btn-sm btn-outline-primary rounded-pill px-3">Browse</Link>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Dashboard