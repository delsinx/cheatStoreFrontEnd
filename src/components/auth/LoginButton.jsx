import React from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';

const LoginButton = ({ className = '', children = 'Login' }) => {
  const { login, isLoading } = useAuth();

  return (
    <Button
      onClick={login}
      disabled={isLoading}
      className={className}
    >
      <LogIn className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
};

export default LoginButton;

