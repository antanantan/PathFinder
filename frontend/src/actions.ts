// marks server-side functions callable by the client
'use server'; 

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Creates a Supabase client with server side creds 
// DO NOT expose to client/broweser 
const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
     auth: {
        autoRefreshToken: false,
        persistSession: false
     }
    }
);
//get client for performing admin auth actions
const adminAuthClient = supabaseAdmin.auth.admin;

interface ActionResult {
    error: string | null;
}

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
        // Can add email_confirm : true for users to verify email but need separate process to send confirmation email e.g. supabase.auth.admin.inviteUserByEmail()
    });

    if (error) {
        console.error('Supabase Admin Error:', error);
        return { error: error.message };
    }

    console.log ('User created successfully:', data.user?.email);
    return { error: null };
}

