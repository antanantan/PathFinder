// marks server-side functions callable by the client
'use server'; 

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import supabase from './utils/supabase';


// ------------------------------------------------- 
// Type definitions | Interfaces and types
//--------------------------------------------------


interface ActionResult {
    error: string | null;
    success?: boolean; // Can be true if action succeeds, but not necessary for all actions
    message?: string; // For success messages or additional info
}

interface CreateGoalResult{
    error: string | null;
    success: boolean;
}




// ------------------------------------------------- 
// Constants and Clients
//--------------------------------------------------

const API_URL = import.meta.env.VITE_API_URL 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Runtime check to ensure the environment variables are defined and crash immediately if missing any configs

if (!supabaseUrl || !supabaseServiceKey || !API_URL ) {
  throw new Error("CRITICAL ERROR: Missing environment variables for server actions. Please check your .env file.");
}

// Creates a Supabase client with server side creds 
const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,{
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
//get client for performing admin auth actions
export const adminAuthClient = supabaseAdmin.auth.admin;

// ------------------------------------------------- 
//Exported functions for server actions
//--------------------------------------------------


/**
 * Server Action to handle user sign-ups.
 * Executed securely on the server to protect sensitive operations.
 *Uses the Supabase admin client with a service_role key, which should
 * never be exposed on the client. Giving us a secure and controlled
 * way to create users without enabling public sign-ups in the Supabase UI
 *
 * @param _prevState - The previous state returned by this action. The underscore
 * is because it's required by the useActionState hook but is intentionally unused here.
 * @param formData - The form data submitted by the client, containing the email and password.
 * @returns An ActionResult object indicating success (error: null) or failure (error: "message").
 */

export async function signUpAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password || password.length < 6){
        return { error: 'Invalid email or password. Password must be at least 6 characters.' };
    }

    //Use admin auth client to create user
    const { data, error } = await adminAuthClient.createUser({
        email: email,
        password: password,
        email_confirm: true, 
    });

    if (error) {
        console.error('Supabase Admin Error:', error);
        return { error: error.message };
    }

    console.log ('User created successfully:', data.user?.email);
    return { success: true, error: null };
}


/**
 * A Server Action to handle user login.
 * @param prevState - The previous state from the last execution of the action.
 * @param formData - The data submitted from the form.
 * @returns An ActionResult object with an error message if one occurred.
 */

export async function loginAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    // Extract form data
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Simple validation
    if (!email || !password ){
        return { error: 'Email and password are required.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    // Handle errors
    if (error) {
        console.error('Login Error:', error);
        return { error: 'Invalid login credentials.' }; // Generic error message for security (enumeration attacks)
    }

    return { success: true, error: null };

}



/**
 * Server Action to create  a new goal by calling our backend API
 */
export async function createGoalAction(_prevState: CreateGoalResult, formData: FormData): Promise<CreateGoalResult>{
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if(!title){
        return { error: 'Title is required.', success: false };
    }

    try {
        // Get current user's session to retreieve JWT 
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session){
            return { error: 'You must be logged in to create a goal.', success: false };
        }

        const response = await axios.post(
            `${API_URL}/api/v1/goals`,
            {title, description},
            {
                headers: {
                    // We pass the user's JWT token as a bearer token and our backend will decode the token to securely identify the user making the request
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
            );
            // 201 status code is standard for successful resource creation
        if (response.status === 201){
            console.log('Goal created successfully:', response.data);
            return {error: null, success: true};
        }else{
            // Handles unexpected success cases that aren't 201
            return { error: 'Failed to create goal. Please try again.', success: false };
        }
        } catch (err) {
            // generic error returned to UI for security, and console log for debugging
            console.log('Error creating goal:', err);
            return { error: 'An unexpected error occurred while creating the goal.', success: false };
}}