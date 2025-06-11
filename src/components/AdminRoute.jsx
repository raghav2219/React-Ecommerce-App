import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../services/authService';
import { toast } from 'react-hot-toast';

const AdminRoute = () => {
    const { isLoggedIn, user: contextUser } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!isLoggedIn) {
                setIsLoading(false);
                return;
            }
            
            try {
                // Always fetch fresh user data to ensure admin status is current
                const currentUser = await getCurrentUser();
                const userIsAdmin = Boolean(currentUser?.isAdmin);
                
                // Log for debugging
                console.log('AdminRoute - User admin status:', {
                    contextUser: contextUser,
                    currentUser: currentUser,
                    isAdmin: userIsAdmin
                });
                
                setIsAdmin(userIsAdmin);
                
                // Show error message if user is not admin
                if (!userIsAdmin) {
                    toast.error('Access denied. Admin privileges required.');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                toast.error('Error verifying admin privileges');
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAdminStatus();
    }, [isLoggedIn, contextUser]);
    
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    
    if (!isLoggedIn) {
        // Redirect to login page with the return URL
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }
    
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    
    return <Outlet />;
};

export default AdminRoute;
