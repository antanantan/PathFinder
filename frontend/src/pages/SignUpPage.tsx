// Client component allowing it to use hooks
'use client';

import { useActionState } from 'react';
import { Navigate } from 'react-router-dom';
import { signUpAction } from '../actions';

const initialState = {
    error: null,
    success: false, 
    message: '',
};

const SignUpPage = () => {
    // useActionState takes the server action and initial state
    // It returns the current state, a dispatch function for the action, and a pending status
    const [state, submitAction, isPending] = useActionState(signUpAction, initialState);

    // If action was successful, render the Navigate component to redirect
    if (state.success) {
        // Redirect to the login page after successful signup
        // Pass the success message and email in the state
        return <Navigate to="/login" state={{ message: state.message, email: new FormData(document.querySelector('form')!).get('email')}} replace />;
    }

    return (
        <div>
            <h2>Create Your Account</h2>
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
                {isPending ? 'Signing Up...' : 'Sign Up'}
            </button>

            {state.error && <p style={{ color: 'red'}}>{state.error}</p>}
            </form>
        </div>
    );
};

export default SignUpPage;



