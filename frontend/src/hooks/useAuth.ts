import {useState, useEffect} from 'react';
/// Use 'import type' because they are only used as type annotations and not runtime values
// 
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import supabase from '../utils/supabase';

/**
 * React hook to provide authentication state throughout app
 * Manages the user session, user data, and loading state in a central place
 * and responds to real-time changes in the auth state
 * @returns An object containing the current session, user, and a loading boolean
 */
export function useAuth() {
    const[session, setSession] = useState<Session | null>(null);
    const[user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Immediately fetches the current session and restores the user's state on page load
        supabase.auth.getSession().then(({ data: { session} }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

    // Set up a real-time listener for authentication state changes
    // Updates the UI instantly when a user logs in or out in another browser or tab/window
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Cleanup function runs when the component unmounts
    // Unsubscribing from the listener to prevent memory leaks
    return () => {
      subscription?.unsubscribe();
    };
  }, []); // The empty dependency array `[]` ensures this effect runs only once on mount.

  return { session, user, loading };
}