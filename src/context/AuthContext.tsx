import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../utils/api';
import { type User, type AuthResponse } from '../types';
import { useSession, signOut as baSignOut } from '../lib/auth-client';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  demoLogin: (role: 'user' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve Better Auth session
  const { data: baSession, isPending: baSessionPending } = useSession();

  // Load saved credentials or sync with Better Auth session
  useEffect(() => {
    if (baSession?.user) {
      // If Better Auth (Google login) has an active session
      setUser({
        _id: baSession.user.id,
        name: baSession.user.name,
        email: baSession.user.email,
        role: (baSession.user as any).role || 'user',
        avatar: baSession.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(baSession.user.name)}&background=6C5CE7&color=fff`
      } as User);
      setToken('better-auth-session-active');
      setIsLoading(false);
    } else {
      // Fallback to local storage (JWT session)
      const savedToken = localStorage.getItem('jobnest_token');
      const savedUser = localStorage.getItem('jobnest_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      if (!baSessionPending) {
        setIsLoading(false);
      }
    }
  }, [baSession, baSessionPending]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('jobnest_token', data.token);
    localStorage.setItem('jobnest_user', JSON.stringify(data.user));
    toast.success(`Welcome back, ${data.user.name}!`);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('jobnest_token', data.token);
    localStorage.setItem('jobnest_user', JSON.stringify(data.user));
    toast.success('Account created successfully!');
  };

  const logout = async () => {
    // Clear JWT state
    setToken(null);
    setUser(null);
    localStorage.removeItem('jobnest_token');
    localStorage.removeItem('jobnest_user');
    
    // Clear Better Auth state (e.g. Google OAuth session)
    try {
      await baSignOut();
    } catch (err) {
      console.warn('Better Auth logout warning:', err);
    }
    
    toast.success('Logged out successfully');
  };

  const demoLogin = async (role: 'user' | 'admin') => {
    const credentials = role === 'admin' 
      ? { email: 'shimul181163@gmail.com', password: '12345678' }
      : { email: 'user@jobnest.com', password: 'User@123' };
    await login(credentials.email, credentials.password);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading: isLoading || baSessionPending,
      isAuthenticated: !!token && !!user,
      login,
      register,
      logout,
      demoLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
