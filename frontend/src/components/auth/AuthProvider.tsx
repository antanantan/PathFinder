import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useAuth } from '../../hooks/useAuth';

/**
 * Authprovider component wraps the part of the application that needs access to auth state. Centralizes the call to the 'useAuth' hook
 * ensuring the session is only fetched once and state is shared with all descendant components.
 */
export const AuthProvider = ({ children }: {children: ReactNode}) => {
    // Custom hook is only called once in the provider
    const auth = useAuth();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
};

