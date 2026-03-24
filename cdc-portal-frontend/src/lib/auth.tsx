'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Company } from '@/types';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User, company: Company | null, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    const savedCompany = localStorage.getItem('auth_company');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      if (savedCompany) {
        setCompany(JSON.parse(savedCompany));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const { user, company, token } = response.data;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    if (company) {
      localStorage.setItem('auth_company', JSON.stringify(company));
    }
    
    setUser(user);
    setCompany(company);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors during logout
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_company');
    setUser(null);
    setCompany(null);
  };

  const setAuth = (user: User, company: Company | null, token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    if (company) {
      localStorage.setItem('auth_company', JSON.stringify(company));
    }
    setUser(user);
    setCompany(company);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
