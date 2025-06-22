import {Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

const ProtectedRoute = () => {
    // Consume the context instead of calling useAuth() directly
    const { user, loading } = useAuthContext();

    // While checking auth state, show loading message
    if(loading){
        return <div>Loading...</div>;
    }
    // If a user is logged in show the nested route component
    if(user){
        return <Outlet />;
    }
    // If no user and loading is complete, redirect to login page
    return <Navigate to="/login" replace />; 
    };

export default ProtectedRoute;