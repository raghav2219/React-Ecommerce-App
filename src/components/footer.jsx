import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-light py-5 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h4 className="text-primary mb-3">
                <i className="fas fa-shopping-bag me-2"></i>React Ecommerce
              </h4>
              <p className="text-muted mb-4">
                Your one-stop shop for all your needs. Quality products at great prices.
              </p>
              <div className="social-icons">
                <a
                  href="#!"
                  className="btn btn-outline-primary btn-floating me-2"
                  style={{ borderRadius: '50%' }}
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#!"
                  className="btn btn-outline-primary btn-floating me-2"
                  style={{ borderRadius: '50%' }}
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#!"
                  className="btn btn-outline-primary btn-floating me-2"
                  style={{ borderRadius: '50%' }}
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#!"
                  className="btn btn-outline-primary btn-floating me-2"
                  style={{ borderRadius: '50%' }}
                >
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="text-primary mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <NavLink to="/" className="text-muted">
                    <i className="fas fa-home me-2"></i>Home
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/product" className="text-muted">
                    <i className="fas fa-box me-2"></i>Products
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/about" className="text-muted">
                    <i className="fas fa-info-circle me-2"></i>About
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/contact" className="text-muted">
                    <i className="fas fa-envelope me-2"></i>Contact
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="text-primary mb-3">Contact Us</h5>
              <div className="contact-info">
                <div className="mb-3">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  <span>123 Shopping Street, E-commerce City</span>
                </div>
                <div className="mb-3">
                  <i className="fas fa-phone me-2"></i>
                  <span>+1 234 567 8900</span>
                </div>
                <div className="mb-3">
                  <i className="fas fa-envelope me-2"></i>
                  <span>support@reactecommerce.com</span>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center text-muted">
            <p className="mb-0">
              © 2025 React Ecommerce. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
