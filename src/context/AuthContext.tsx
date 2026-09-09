import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../utils/api';
import { type User, type AuthResponse } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (param: { credential?: string; accessToken?: string } | string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved JWT credentials from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('jobnest_token');
    const savedUser = localStorage.getItem('jobnest_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

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

  const googleLogin = async (param: { credential?: string; accessToken?: string } | string) => {
    const payload = typeof param === 'string' ? { credential: param } : param;
    const { data } = await api.post<AuthResponse>('/auth/google', payload);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('jobnest_token', data.token);
    localStorage.setItem('jobnest_user', JSON.stringify(data.user));
    toast.success(`Welcome back, ${data.user.name}!`);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jobnest_token');
    localStorage.removeItem('jobnest_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      register,
      googleLogin,
      logout,
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
