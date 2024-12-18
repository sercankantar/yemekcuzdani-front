'use client'; // Bu satır, bu bileşenin client-side'da çalışmasını sağlar.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/app/lib/auth'; // getCurrentUser fonksiyonunu buradan import ettik

interface AuthContextType {
  currentUser: any; // currentUser tipi
  setCurrentUser: (user: any) => void;
  token: string | null;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null); // Token'ı localStorage'dan alıyoruz
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const user = await getCurrentUser(token); // getCurrentUser fonksiyonunu burada çağırıyoruz
          setCurrentUser(user); // Kullanıcıyı set ediyoruz
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      }
      setIsLoading(false); // Veriler alındıktan sonra loading durumunu false yapıyoruz
    };

    fetchCurrentUser();
  }, [token]); // Token değiştiğinde useEffect çalışacak

  if (isLoading) {
    return null; // Loading state can be shown here
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
