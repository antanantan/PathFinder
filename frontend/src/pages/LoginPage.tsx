// Client component allowing it to use hooks
'use client';

import { useActionState } from 'react';
import { Navigate } from 'react-router-dom';
import { loginAction } from '../actions';

const initialState = {
    error: null,
    success: false,  
};

const LoginPage = () => {
    // useActionState takes the server action and initial state
    // It returns the current state, a dispatch function for the action, and a pending status
    const [state, submitAction, isPending] = useActionState(loginAction, initialState);

    // If action was successful, we render the Navigate component 
    if (state.success) {
        // replace prop replaces the 'login' route in the history stack
        // the user can't click the back button and return to the login page
        return <Navigate to="/dashboard" replace />;
    }

    // If we are not redirecting, we render the login form normally
    return (
        <div>
            <h2>Log In to Your Account</h2>
            <form action={submitAction}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="youremail@example.com"
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="*******"
                    required
                />
            </div>

            <button type="submit" disabled={isPending}>
                {isPending ? 'Logging In...' : 'Log In'}
            </button>

            {state.error && <p style={{ color: 'red'}}>{state.error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;



