import React, { useState } from 'react';
import { Box, VStack, Heading, Input, Button, Text, Divider } from '@chakra-ui/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleLogin } from 'react-google-login';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement login/registration logic
    setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
  };

  const handleGoogleSuccess = async (response) => {
    // TODO: Implement Google Sign-In logic
    console.log('Google Sign-In successful', response);
    setMessage('Google Sign-In successful!');
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In failed', error);
    setMessage('Google Sign-In failed. Please try again.');
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <VStack spacing={4} align="stretch">
        <Heading>{isLogin ? 'Login' : 'Register'}</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" colorScheme="green" width="full">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </VStack>
        </form>
        <Divider />
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Sign in with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={'single_host_origin'}
        />
        <Text textAlign="center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </Button>
        </Text>
        {message && (
          <Alert status={message.includes('successful') ? 'success' : 'error'}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default LoginPage;
