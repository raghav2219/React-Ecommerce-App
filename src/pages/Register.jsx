import React, { useState } from 'react'
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        validateField(name, value);
    };

    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };
        
        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    newErrors.name = 'Name is required';
                } else if (value.length < 2) {
                    newErrors.name = 'Name must be at least 2 characters';
                } else {
                    delete newErrors.name;
                }
                break;
            case 'email':
                if (!value.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    newErrors.email = 'Invalid email address';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'password':
                if (!value.trim()) {
                    newErrors.password = 'Password is required';
                } else if (value.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                } else {
                    delete newErrors.password;
                }
                break;
            case 'confirmPassword':
                if (!value.trim()) {
                    newErrors.confirmPassword = 'Confirm password is required';
                } else if (value !== formData.password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            default:
                break;
        }
        
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Validate all fields
        const allErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            validateField(key, value);
        });

        if (Object.keys(errors).length === 0) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success('Registration successful! Please login to continue.');
                navigate('/login');
            } catch (error) {
                toast.error('Registration failed. Please try again.');
            }
        }
        setLoading(false);
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
                                    <div className="mb-4">
                                        <label htmlFor="name" className="form-label fw-semibold">
                                            <i className="fas fa-user me-2"></i>Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            disabled={loading}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback d-block">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            <i className="fas fa-envelope me-2"></i>Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            disabled={loading}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback d-block">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-semibold">
                                            <i className="fas fa-lock me-2"></i>Password
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a password"
                                            disabled={loading}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback d-block">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                            <i className="fas fa-lock me-2"></i>Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            disabled={loading}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback d-block">
                                                {errors.confirmPassword}
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-grid gap-3">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary py-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-user-plus me-2"></i>Create Account
                                                </>
                                            )}
                                        </button>
                                        <Link to="/login" className="btn btn-outline-primary py-2">
                                            <i className="fas fa-sign-in-alt me-2"></i>Back to Login
                                        </Link>
                                    </div>
                                    <div className="text-center mt-3">
                                        <p className="mb-0">
                                            By creating an account, you agree to our 
                                            <Link to="/terms" className="text-primary">Terms of Service</Link>
                                            and 
                                            <Link to="/privacy" className="text-primary">Privacy Policy</Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
};

export default Register