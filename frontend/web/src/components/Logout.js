import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useToast } from '@chakra-ui/react';

function Logout() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();

    // Clear local storage
    localStorage.clear();

    // Clear any cookies (if used for authentication)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log('User logged out');

    // Show a success toast
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Redirect to home page
    navigate('/');
  };

  return (
    <Button onClick={handleLogout} colorScheme="red">
      Logout
    </Button>
  );
}

export default Logout;
