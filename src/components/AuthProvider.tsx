
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Vérifier la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, redirecting to dashboard");
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to landing");
        navigate("/");
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Protection des routes
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ['/', '/landing'];
      const isPublicRoute = publicPaths.includes(location.pathname);
      
      if (user && isPublicRoute) {
        console.log("Authenticated user on public route, redirecting to dashboard");
        navigate('/dashboard');
      } else if (!user && !isPublicRoute) {
        console.log("Unauthenticated user on protected route, redirecting to root");
        navigate('/');
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
