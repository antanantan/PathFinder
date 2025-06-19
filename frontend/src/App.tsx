import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUpPage from './pages/SignUpPage';

import './App.css';

/** App to set up router and define routes for different pages */

function App() {
    return (
        // BrowserRouter provides routing context for entire app
        <BrowserRouter>
            <Routes>
                {/* Route for the home page */}
                <Route path="/" element={<div>Home Page</div>} />

                {/* Define a route for the signup page */}
                <Route path="/signup" element={<SignUpPage />} />

                {/* Add more routes */}




            </Routes>
        </BrowserRouter>
    )
}

export default App;