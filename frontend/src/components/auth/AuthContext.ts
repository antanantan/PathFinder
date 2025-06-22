import {createContext, useContext} from 'react';
import type { Session, User } from '@supabase/supabase-js';

// Define the shape of the data that our context will provide
export interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
}
// Create the context
// Provide 'undefined' as the default value to force a runtime error if a component tries to 
// use this context without being wrapped in the AuthProvider
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

//hook to access the auth context so components don't need to call 'useContext(AuthContext)' directly. 
export const useAuthContext = () => {
    // Runtime safeguard, if the hook is used in a component that isn't a child of <AuthProvider>, it will crash with a clear error message
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
