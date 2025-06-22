import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Standard Client for user-level operations (e.g. sign-up, login)
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase