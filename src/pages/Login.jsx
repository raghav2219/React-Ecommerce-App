import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
        await login(formData);
        toast.success('Login successful!');
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
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
              <i className="fas fa-sign-in-alt me-2 text-primary"></i>Welcome Back
            </h1>
            <p className="lead mb-4">
              Sign in to your account to continue shopping and access your order history.
            </p>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm rounded-3">
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4">Login to Your Account</h2>
                <form onSubmit={handleSubmit}>
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
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
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
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>Login
                        </>
                      )}
                    </button>
                    <Link to="/register" className="btn btn-outline-primary py-2">
                      <i className="fas fa-user-plus me-2"></i>Create Account
                    </Link>
                  </div>
                  {/* <div className="text-center mt-3">
                    <Link to="/forgot-password" className="text-primary">
                      Forgot Password?
                    </Link>
                  </div> */}
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

export default Login;
