import React, { useState, useEffect } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import { apiUrl, fileUrl } from '../../common/config'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        try {
            const res = await fetch(`${apiUrl}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setUser(result.data);
                // Set form values
                const data = result.data;
                setValue('name', data.name);
                setValue('email', data.email);
                setValue('mobile', data.mobile || '');
                setValue('designation', data.designation || '');
                setValue('language', data.language || '');
                setValue('nationality', data.nationality || '');
                setValue('birthday', data.birthday || '');
                setValue('gender', data.gender || '');
                setValue('bio', data.bio || '');
                if (data.profile_pic) {
                    // Support both Cloudinary URLs (absolute) and local storage paths
                    const picUrl = data.profile_pic.startsWith('http')
                        ? data.profile_pic
                        : `${fileUrl}/storage/${data.profile_pic}`;
                    setImagePreview(picUrl);
                }
            }
        } catch (error) {
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        
        const imageInput = document.getElementById('image');
        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        try {
            const res = await fetch(`${apiUrl}/update-profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });
            const result = await res.json();

            if (res.ok) {
                toast.success('Profile updated successfully');
                fetchProfile();
            } else {
                toast.error(result.message || 'Error updating profile');
            }
        } catch (error) {
            toast.error('Error updating profile');
        }
    };

    if (loading) return <Layout><div className="text-center py-5">Loading...</div></Layout>;

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <h2 className='h4 mb-0 pb-0'>My Profile</h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='card border-0 shadow'>
                                <div className='card-body p-4'>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row">
                                            <div className="col-md-4 mb-4 text-center">
                                                <div className="profile-img-container mb-3">
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Profile" className="img-fluid rounded-circle shadow-sm" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm" style={{ width: '150px', height: '150px' }}>
                                                            <span className="text-muted fs-1">{user?.name?.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <input type="file" id="image" className="form-control form-control-sm" onChange={handleImageChange} accept="image/*" />
                                                <small className="text-muted">JPG, PNG or GIF. Max 2MB</small>
                                            </div>

                                            <div className="col-md-8">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Full Name</label>
                                                        <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} {...register('name', { required: 'Name is required' })} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Email Address</label>
                                                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email', { required: 'Email is required' })} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Mobile Number</label>
                                                        <input type="text" className="form-control" {...register('mobile')} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Designation</label>
                                                        <input type="text" className="form-control" {...register('designation')} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Language</label>
                                                        <input type="text" className="form-control" {...register('language')} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Nationality</label>
                                                        <input type="text" className="form-control" {...register('nationality')} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Birthday</label>
                                                        <input type="date" className="form-control" {...register('birthday')} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Gender</label>
                                                        <select className="form-select" {...register('gender')}>
                                                            <option value="">Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="form-label">Bio</label>
                                                        <textarea className="form-control" rows="4" {...register('bio')}></textarea>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <button type="submit" className="btn btn-primary px-4">Save Changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Profile
