import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = () => {
  const { isLoggedIn } = useAuth();

  // If user is logged in, redirect to home page
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the child routes
  return <Outlet />;
};

export default GuestRoute;
