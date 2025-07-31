import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Configurar axios interceptor para incluir token automaticamente
  useEffect(() => {
    const setupAxiosInterceptor = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          
          // Configurar interceptor para requests
          api.interceptors.request.use(
            (config) => {
              config.headers.Authorization = `Bearer ${token}`;
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );

          // Buscar perfil do usuário
          const response = await api.get('/api/auth/profile');
          if (response.data.success) {
            setUserProfile(response.data.user);
            setIsAdmin(response.data.user.roles?.includes('admin') || false);
          }
        } catch (error) {
          console.error('Error setting up auth:', error);
        }
      } else {
        // Limpar interceptors quando não autenticado
        api.interceptors.request.clear();
        setUserProfile(null);
        setIsAdmin(false);
      }
    };

    if (!isLoading) {
      setupAxiosInterceptor();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  const login = () => {
    loginWithRedirect();
  };

  const logoutUser = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    logout: logoutUser,
    getAccessTokenSilently
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

