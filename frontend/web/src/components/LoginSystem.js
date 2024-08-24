import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function LoginSystem() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic client-side validation
    if (!email || !password || !userType) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual login logic here
      // This should involve a call to your backend API
      console.log('Login submitted:', { email, userType });

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect based on user type
      switch (userType) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'farmer':
          navigate('/farmer-dashboard');
          break;
        case 'customer':
          navigate('/user-dashboard');
          break;
        case 'community':
          navigate('/community-dashboard');
          break;
        default:
          throw new Error('Invalid user type');
      }

      toast({
        title: 'Login successful',
        description: `Welcome back, ${userType}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Login
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Access your Growers Gate account
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>User Type</FormLabel>
              <Select
                placeholder="Select user type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="farmer">Farmer</option>
                <option value="customer">Customer</option>
                <option value="community">Community</option>
              </Select>
            </FormControl>
            <Button
              type="submit"
              colorScheme="green"
              width="full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}

export default LoginSystem;
