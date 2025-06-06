import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const state = useSelector(state => state.handleCart);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isLoggedIn = useAuth().isLoggedIn;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
                    <i className="fas fa-shopping-bag me-2 text-primary"></i>Zenith Store
                </NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink 
                                className="nav-link fw-semibold px-3" 
                                to="/" 
                                activeClassName="active"
                                style={({ isActive }) => ({
                                    color: isActive ? '#0d6efd' : '#333',
                                    borderBottom: isActive ? '2px solid #0d6efd' : 'none'
                                })}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                className="nav-link fw-semibold px-3" 
                                to="/product" 
                                activeClassName="active"
                                style={({ isActive }) => ({
                                    color: isActive ? '#0d6efd' : '#333',
                                    borderBottom: isActive ? '2px solid #0d6efd' : 'none'
                                })}
                            >
                                Products
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                className="nav-link fw-semibold px-3" 
                                to="/about" 
                                activeClassName="active"
                                style={({ isActive }) => ({
                                    color: isActive ? '#0d6efd' : '#333',
                                    borderBottom: isActive ? '2px solid #0d6efd' : 'none'
                                })}
                            >
                                About
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                className="nav-link fw-semibold px-3" 
                                to="/contact" 
                                activeClassName="active"
                                style={({ isActive }) => ({
                                    color: isActive ? '#0d6efd' : '#333',
                                    borderBottom: isActive ? '2px solid #0d6efd' : 'none'
                                })}
                            >
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center d-flex align-items-center">
                        {isLoggedIn ? (
                            <div className="d-flex align-items-center">
                                <span className="me-3 fw-semibold text-primary">
                                    <i className="fas fa-user-circle me-1"></i>
                                    Welcome, {user?.name || user?.email?.split('@')[0]}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="btn btn-outline-danger me-2 px-4 rounded-pill"
                                >
                                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <NavLink 
                                    to="/login" 
                                    className="btn btn-outline-primary me-2 px-4 rounded-pill"
                                >
                                    <i className="fas fa-sign-in-alt me-1"></i> Login
                                </NavLink>
                                <NavLink 
                                    to="/register" 
                                    className="btn btn-outline-primary me-2 px-4 rounded-pill"
                                >
                                    <i className="fas fa-user-plus me-1"></i> Register
                                </NavLink>
                            </>
                        )}
                        <NavLink 
                            to="/cart" 
                            className="btn btn-primary px-4 rounded-pill position-relative"
                        >
                            <i className="fas fa-shopping-cart me-1"></i>
                            Cart
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {state.length}
                                <span className="visually-hidden">items in cart</span>
                            </span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar