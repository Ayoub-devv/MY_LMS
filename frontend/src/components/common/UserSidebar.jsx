import React, { useContext } from 'react'
import { User, LayoutDashboard, GraduationCap, MonitorPlay, Users, KeyRound, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const UserSidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    const isAdmin = userInfo.role === 'admin';

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/account/login');
    }

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    }

  return (
    <div className='card border-0 shadow-sm'>
        <div className='card-body p-3'>
            <div className="list-group list-group-flush">
                <Link to="/account/profile" className={`list-group-item list-group-item-action d-flex align-items-center text-decoration-none ${isActive('/account/profile')}`}>
                    <User size={18} className='me-3' /> My Profile
                </Link>
                <Link to="/account/dashboard" className={`list-group-item list-group-item-action d-flex align-items-center text-decoration-none ${isActive('/account/dashboard')}`}>
                    <LayoutDashboard size={18} className='me-3' /> Dashboard
                </Link>
                <Link to="/account/my-learning" className={`list-group-item list-group-item-action d-flex align-items-center text-decoration-none ${isActive('/account/my-learning')}`}>
                    <GraduationCap size={18} className='me-3' /> My Learning
                </Link>
                {isAdmin && (
                    <>
                        <Link to="/account/my-courses" className={`list-group-item list-group-item-action d-flex align-items-center text-decoration-none ${isActive('/account/my-courses')}`}>
                            <MonitorPlay size={18} className='me-3' /> My Courses
                        </Link>
                        <Link to="/account/student-progress" className={`list-group-item list-group-item-action d-flex align-items-center text-decoration-none ${isActive('/account/student-progress')}`}>
                            <Users size={18} className='me-3' /> Student Progress
                        </Link>
                    </>
                )}
                <Link to="/account/change-password" className={`list-group-item list-group-item-action d-flex align-items-center text-decoration-none ${isActive('/account/change-password')}`}>
                    <KeyRound size={18} className='me-3' /> Change Password
                </Link>
                <a href="#" onClick={handleLogout} className='list-group-item list-group-item-action d-flex align-items-center text-danger text-decoration-none mt-2'>
                    <LogOut size={18} className='me-3' /> Logout
                </a>
            </div>
        </div>                             
    </div>
  )
}

export default UserSidebar
