// Client component allowing it to use hooks
'use client';

import { useActionState } from 'react';
import { signUpAction } from '../actions';

const initialState = {
    error: null
};

const SignUpPage = () => {
    // useActionState takes the server action and initial state
    // It returns the current state, a dispatch function for the action, and a pending status
    const [state, submitAction, isPending] = useActionState(signUpAction, initialState);

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



