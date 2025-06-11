import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock, FaPaperPlane, FaUser, FaTag, FaComment } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
          newErrors.name = 'Name must be at least 2 characters long';
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
      case 'subject':
        if (!value.trim()) {
          newErrors.subject = 'Subject is required';
        } else if (value.length < 5) {
          newErrors.subject = 'Subject must be at least 5 characters long';
        } else {
          delete newErrors.subject;
        }
        break;
      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required';
        } else if (value.length < 10) {
          newErrors.message = 'Message must be at least 10 characters long';
        } else {
          delete newErrors.message;
        }
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const allFields = ['name', 'email', 'subject', 'message'];
    allFields.forEach(field => validateField(field, formData[field]));
    
    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/api/contact/send', formData);
        toast.success(response.data.message);
        // Reset form after successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error sending message. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5 py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold mb-4">
              <FaEnvelope className="me-2 text-primary" />Get in Touch
            </h1>
            <p className="lead mb-4">
              We're here to help! Whether you have questions about our products, 
              need support, or want to share feedback, we're just a message away.
            </p>
            <div className="contact-info mb-4">
              <div className="info-item d-flex mb-4">
                <FaMapMarkerAlt className="text-primary me-3 mt-1" />
                <div>
                  <h5 className="mb-1">Our Location</h5>
                  <p className="mb-0">123 Shopping Street, E-commerce City</p>
                </div>
              </div>
              <div className="info-item d-flex mb-4">
                <FaPhone className="text-primary me-3 mt-1" />
                <div>
                  <h5 className="mb-1">Phone</h5>
                  <p className="mb-0">+1 234 567 8900</p>
                </div>
              </div>
              <div className="info-item d-flex mb-4">
                <FaEnvelope className="text-primary me-3 mt-1" />
                <div>
                  <h5 className="mb-1">Email</h5>
                  <p className="mb-0">support@reactecommerce.com</p>
                </div>
              </div>
              <div className="info-item d-flex">
                <FaClock className="text-primary me-3 mt-1" />
                <div>
                  <h5 className="mb-1">Working Hours</h5>
                  <p className="mb-0">Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            <div className="social-links">
              <h5 className="mb-3">Follow Us</h5>
              <div className="d-flex gap-2">
                <a href="/" className="btn btn-outline-primary rounded-circle p-2">
                  <FaFacebookF />
                </a>
                <a href="/" className="btn btn-outline-primary rounded-circle p-2">
                  <FaTwitter />
                </a>
                <a href="/" className="btn btn-outline-primary rounded-circle p-2">
                  <FaInstagram />
                </a>
                <a href="/" className="btn btn-outline-primary rounded-circle p-2">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm rounded-3">
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4">Send us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-semibold">
                      <FaUser className="me-2" />Full Name
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
                      <FaEnvelope className="me-2" />Email Address
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
                    <label htmlFor="subject" className="form-label fw-semibold">
                      <FaTag className="me-2" />Subject
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                      disabled={loading}
                    />
                    {errors.subject && (
                      <div className="invalid-feedback d-block">
                        {errors.subject}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label fw-semibold">
                      <FaComment className="me-2" />Message
                    </label>
                    <textarea
                      className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message"
                      disabled={loading}
                    ></textarea>
                    {errors.message && (
                      <div className="invalid-feedback d-block">
                        {errors.message}
                      </div>
                    )}
                  </div>
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary py-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="me-2" />Send Message
                        </>
                      )}
                    </button>
                  </div>
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

export default ContactPage;
