import React, { useState, useEffect } from 'react';
import Layout from '../../common/Layout';
import UserSidebar from '../../common/UserSidebar';
import { apiUrl } from '../../common/config';
import { ProgressBar, Table } from 'react-bootstrap';

const StudentProgress = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token;

        try {
            const res = await fetch(`${apiUrl}/admin/student-progress`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setEnrollments(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching student progress');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <h2 className='h4 mb-0 pb-0'>Student Learning Progress</h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='card border-0 shadow-sm'>
                                <div className='card-body p-4'>
                                    {loading ? (
                                        <div className="text-center py-4">Loading...</div>
                                    ) : enrollments.length === 0 ? (
                                        <p className="text-muted">No student enrollments found.</p>
                                    ) : (
                                        <Table hover responsive className="align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Student</th>
                                                    <th>Course</th>
                                                    <th style={{ width: '200px' }}>Progress</th>
                                                    <th>Enrollment Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {enrollments.map((en, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="fw-bold">{en.user?.name}</div>
                                                            <small className="text-muted">{en.user?.email}</small>
                                                        </td>
                                                        <td>{en.course?.title}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <ProgressBar 
                                                                    now={en.progress_percentage} 
                                                                    variant={en.progress_percentage === 100 ? "success" : "primary"} 
                                                                    className="flex-grow-1 me-2" 
                                                                    style={{ height: '8px' }}
                                                                />
                                                                <small className="fw-bold">{en.progress_percentage}%</small>
                                                            </div>
                                                        </td>
                                                        <td className="small">{new Date(en.created_at).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default StudentProgress;
