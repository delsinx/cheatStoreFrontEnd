import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';

const SignUpButton = ({ variant = "default", size = "default", className = "" }) => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <Button 
      onClick={handleSignUp} 
      variant={variant} 
      size={size}
      className={`${className} cheat-button`}
    >
      <UserPlus className="mr-2 h-4 w-4" />
      Sign Up
    </Button>
  );
};

export default SignUpButton;

