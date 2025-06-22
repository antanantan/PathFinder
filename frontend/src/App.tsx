import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

/** App to set up router and define routes for different pages */

function App() {
    return (
        // BrowserRouter provides routing context for entire app
        <BrowserRouter>
            <Routes>
                {/* Public Routes, accessible to anyone */}
                {/* Root path redirects to login */}
                <Route path="/" element={<LoginPage/>} />

                {/* Route for signup page */}
                <Route path="/signup" element={<SignUpPage/>} />

                {/* Route for login page */}
                <Route path="/login" element={<LoginPage/>} />

                {/* Add more routes */}

                {/* Protected Routes, accessible only to authenticated users 
                    If a user is logged in, it renders DashboardPage if not it redirects to login */}
                <Route element={<ProtectedRoute/>}>

                    <Route path="/dashboard" element={<DashboardPage/>} />

                    {/* Add more protected routes here */}
                
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;