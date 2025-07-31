import React from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ className = '', children = 'Logout' }) => {
  const { logout, isLoading } = useAuth();

  return (
    <Button
      onClick={logout}
      disabled={isLoading}
      variant="outline"
      className={className}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
};

export default LogoutButton;

