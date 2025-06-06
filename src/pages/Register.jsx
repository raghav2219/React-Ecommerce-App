import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";
import { Footer, Navbar } from "../components";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const validateField = (fieldName, value, errorsObj = { ...errors }) => {
        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    errorsObj.name = 'Name is required';
                } else if (value.trim().length < 2) {
                    errorsObj.name = 'Name must be at least 2 characters';
                } else {
                    delete errorsObj.name;
                }
                break;
            case 'email':
                if (!value.trim()) {
                    errorsObj.email = 'Email is required';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    errorsObj.email = 'Invalid email address';
                } else {
                    delete errorsObj.email;
                }
                break;
            case 'password':
                if (!value.trim()) {
                    errorsObj.password = 'Password is required';
                } else if (value.length < 6) {
                    errorsObj.password = 'Password must be at least 6 characters';
                } else {
                    delete errorsObj.password;
                }
                break;
            case 'confirmPassword':
                if (!value.trim()) {
                    errorsObj.confirmPassword = 'Please confirm your password';
                } else if (value !== formData.password) {
                    errorsObj.confirmPassword = 'Passwords do not match';
                } else {
                    delete errorsObj.confirmPassword;
                }
                break;
            default:
                break;
        }
        return errorsObj;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate single field
        const newErrors = validateField(name, value);
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        
        // Validate all fields
        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            validateField(key, value, newErrors);
        });

        // Remove empty errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) delete newErrors[key];
        });

        setErrors(newErrors);
        console.log('Form validation errors:', newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fix the form errors');
            return;
        }

        setLoading(true);
        
        try {
            const registrationData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };
            
            console.log('Attempting to register user with data:', {
                ...registrationData,
                password: '[HIDDEN]'
            });
            
            const response = await register(registrationData);
            console.log('Registration successful, server response:', {
                status: response?.status,
                data: response?.data,
                hasToken: !!response?.token,
                hasUser: !!response?.user
            });
            
            // Check if we got a valid response with user data
            if (response && response.user) {
                toast.success('Registration successful! Redirecting to login...');
                
                // Clear the form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                
                // Redirect to login after a short delay
                setTimeout(() => {
                    console.log('Navigating to /login');
                    navigate('/login');
                }, 1500);
            } else {
                throw new Error('Registration failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Registration error details:', {
                name: error.name,
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.response) {
                // Server responded with an error
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'Unable to connect to the server. Please check your connection.';
            } else {
                // Something else happened
                errorMessage = error.message || errorMessage;
            }
            
            toast.error(errorMessage);
        } finally {
            console.log('Registration process completed, setting loading to false');
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-5 py-5">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h1 className="display-4 fw-bold mb-4">
                            <i className="fas fa-user-plus me-2 text-primary"></i>Create Your Account
                        </h1>
                        <p className="lead mb-4">
                            Join our community of shoppers and start enjoying amazing deals today!
                        </p>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow-sm rounded-3">
                            <div className="card-body p-5">
                                <h2 className="card-title text-center mb-4">Create Your Account</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                        />
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-2 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating Account...
                                            </>
                                        ) : 'Create Account'}
                                    </button>
                                    <p className="text-center mb-0">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-primary">Sign In</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;
