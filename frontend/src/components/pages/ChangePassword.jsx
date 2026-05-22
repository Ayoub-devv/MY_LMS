import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import UserSidebar from '../common/UserSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../common/config'
import { toast } from 'react-toastify'

const ChangePassword = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        const res = await fetch(`${apiUrl}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok && result.status === 200) {
            toast.success(result.message || 'Password changed successfully');
            reset();
        } else {
            if (result.errors) {
                // Handle specific field errors if we wanted to
                toast.error('Validation errors occurred');
            } else {
                toast.error(result.message || 'Error changing password');
            }
        }
    };

    return (
        <>
            <Header />
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <h2 className='h3 mb-0 pb-0'>Change Password</h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='card border-0 shadow'>
                                <div className='card-body p-4'>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='mb-3'>
                                            <label className='form-label'>Old Password</label>
                                            <input 
                                                type='password' 
                                                className={`form-control ${errors.old_password ? 'is-invalid' : ''}`}
                                                placeholder='Old Password'
                                                {...register('old_password', { required: 'Old password is required' })} 
                                            />
                                            {errors.old_password && <span className='invalid-feedback'>{errors.old_password.message}</span>}
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label'>New Password</label>
                                            <input 
                                                type='password' 
                                                className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                                                placeholder='New Password'
                                                {...register('new_password', { 
                                                    required: 'New password is required',
                                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                                })} 
                                            />
                                            {errors.new_password && <span className='invalid-feedback'>{errors.new_password.message}</span>}
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label'>Confirm Password</label>
                                            <input 
                                                type='password' 
                                                className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                                                placeholder='Confirm Password'
                                                {...register('confirm_password', { required: 'Please confirm your new password' })} 
                                            />
                                            {errors.confirm_password && <span className='invalid-feedback'>{errors.confirm_password.message}</span>}
                                        </div>
                                        <div className='d-flex'>
                                            <button type='submit' className='btn btn-primary'>Update Password</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default ChangePassword
