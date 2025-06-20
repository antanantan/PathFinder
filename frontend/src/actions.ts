// marks server-side functions callable by the client
'use server'; 

import { createClient } from '@supabase/supabase-js';

// Standard Client for user-level operations (e.g. sign-up, login)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);


// Creates a Supabase client with server side creds 
const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
//get client for performing admin auth actions
export const adminAuthClient = supabaseAdmin.auth.admin;

interface ActionResult {
    error: string | null;
    success?: boolean; // Can be true if action succeeds, but not necessary for all actions
    message?: string; // For success messages or additional info
}

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