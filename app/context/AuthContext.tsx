'use client'; // Bu satır, bu bileşenin client-side'da çalışmasını sağlar.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/app/lib/auth'; // getCurrentUser fonksiyonunu buradan import ettik
import refreshAccessToken from '../lib/refresh';

interface AuthContextType {
  currentUser: any; // currentUser tipi
  setCurrentUser: (user: any) => void;
  token: string | null;
  setToken: (token: string) => void;
  refreshToken: string | null; // Refresh token ekledik
 setRefreshToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null); // Refresh token state'i ekledik
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
   useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken'); // Refresh token'ı localStorage'dan alıyoruz
      setToken(storedToken);
      setRefreshToken(storedRefreshToken); // Refresh token'ı state'e set ediyoruz
      setIsLoading(false);
    }
  }, []);
   useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const user = await getCurrentUser(token);
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to fetch user', error);
          // Eğer token geçersizse, refresh token ile yeni bir token almayı deneyebiliriz
          if (refreshToken) {
            try {
              const newToken = await refreshAccessToken(refreshToken); // Yeni bir access token al
              setToken(newToken);
              localStorage.setItem('token', newToken); // Yeni token'ı localStorage'a kaydet
            } catch (refreshError) {
              console.error('Failed to refresh token', refreshError);
            }
          }
        }
      }
    };
     fetchCurrentUser();
  }, [token, refreshToken]);  // Token değiştiğinde useEffect çalışacak

  if (isLoading) {
    return null; // Loading state can be shown here
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, token, setToken, refreshToken, setRefreshToken }}>
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
