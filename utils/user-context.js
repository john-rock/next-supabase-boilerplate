// Global context to keep track of user sessions
import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '../supabase-client';

export const UserContext = createContext(null);

export function UserContextProvider(props) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get user session info
    const session = supabase.auth.session();
    setSession(session);

    // Watch for auth changes and hit auth api if changed
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        await fetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ event, session }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const value = {
    session,
  };

  return <UserContext.Provider value={value} {...props} />;
}

// Hook to get user session data
export function useSession() {
  const context = useContext(UserContext);
  return context;
}
