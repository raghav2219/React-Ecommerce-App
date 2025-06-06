import React from 'react'
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-5 py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4">
              <i className="fas fa-shopping-bag me-2 text-primary"></i>About Zenith Store
            </h1>
            <div className="about-content">
              <p className="lead mb-4">
                Welcome to Zenith Store, your premier destination for quality products at unbeatable prices. 
                We're dedicated to providing exceptional shopping experiences to our valued customers.
              </p>
              <div className="feature-list">
                <div className="feature-item mb-3">
                  <i className="fas fa-check-circle text-primary me-2"></i>
                  <span>100% Authentic Products</span>
                </div>
                <div className="feature-item mb-3">
                  <i className="fas fa-shipping-fast text-primary me-2"></i>
                  <span>Fast & Free Shipping</span>
                </div>
                <div className="feature-item mb-3">
                  <i className="fas fa-headset text-primary me-2"></i>
                  <span>24/7 Customer Support</span>
                </div>
                <div className="feature-item mb-3">
                  <i className="fas fa-exchange-alt text-primary me-2"></i>
                  <span>Easy Returns & Exchanges</span>
                </div>
              </div>
              <Link to="/contact" className="btn btn-primary px-4 rounded-pill">
                <i className="fas fa-envelope me-2"></i>Get in Touch
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-image">
              <img 
                src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="About Us" 
                className="img-fluid rounded-3 shadow-lg"
                style={{
                  height: '400px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </div>
          </div>
        </div>

        <div className="py-5">
          <h2 className="text-center mb-4">
            <i className="fas fa-boxes me-2 text-primary"></i>Our Categories
          </h2>
          <div className="row">
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="product-card h-100">
                <div className="product-image">
                  <img 
                    src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Mens's Clothing" 
                    className="img-fluid rounded-3"
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold mb-2">
                    <i className="fas fa-tshirt me-2"></i>Men's Clothing
                  </h5>
                  <p className="text-muted mb-0">Explore our collection of men's fashion</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="product-card h-100">
                <div className="product-image">
                  <img 
                    src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Women's Clothing" 
                    className="img-fluid rounded-3"
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold mb-2">
                    <i className="fas fa-dress me-2"></i>Women's Clothing
                  </h5>
                  <p className="text-muted mb-0">Discover our women's fashion collection</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="product-card h-100">
                <div className="product-image">
                  <img 
                    src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Jewelry" 
                    className="img-fluid rounded-3"
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold mb-2">
                    <i className="fas fa-gem me-2"></i>Jewelry
                  </h5>
                  <p className="text-muted mb-0">Elegant jewelry for every occasion</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="product-card h-100">
                <div className="product-image">
                  <img 
                    src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Electronics" 
                    className="img-fluid rounded-3"
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold mb-2">
                    <i className="fas fa-mobile-alt me-2"></i>Electronics
                  </h5>
                  <p className="text-muted mb-0">Latest gadgets and technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage