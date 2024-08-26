import React, { useState, useContext } from 'react';
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
  Checkbox,
  PinInput,
  PinInputField,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, verify2FA, verify2FARecovery } from '../api';
import { AuthContext } from '../App';

function LoginSystem() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAType, setTwoFAType] = useState('app');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic client-side validation
    if (!email || !password || !userType || (is2FARequired && !twoFACode)) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!is2FARequired) {
        // Initial login attempt
        const response = await apiLogin({ email, password, userType, rememberMe });

        if (response.data.requires2FA) {
          setIs2FARequired(true);
          setTwoFAType(response.data.twoFAType);
          setIsLoading(false);
          return;
        }

        // If 2FA is not required, proceed with login
        await completeLogin(response.data.token);
      } else {
        // 2FA verification
        let verificationResponse;
        if (isUsingRecoveryCode) {
          verificationResponse = await verify2FARecovery({ email, recoveryCode });
        } else {
          verificationResponse = await verify2FA({ email, twoFACode, twoFAType });
        }
        await completeLogin(verificationResponse.data.token);
      }
    } catch (error) {
      if (error.response?.data?.error === '2FA_FAILED') {
        toast({
          title: '2FA Verification Failed',
          description: 'Invalid 2FA code or recovery code. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setTwoFACode('');
        setRecoveryCode('');
      } else {
        handleLoginError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async () => {
    setIsLoading(true);
    try {
      const response = await verify2FA({ email, twoFACode });
      await completeLogin(response.data.token);
    } catch (error) {
      handleLoginError(error);
    }
  };

  const completeLogin = async (token) => {
    login(userType, rememberMe ? token : null);
    navigateToDashboard();
    showSuccessToast();
  };

  const navigateToDashboard = () => {
    const dashboards = {
      admin: '/admin-dashboard',
      farmer: '/farmer-dashboard',
      customer: '/user-dashboard',
      community: '/community-dashboard',
    };
    navigate(dashboards[userType] || '/');
  };

  const showSuccessToast = () => {
    toast({
      title: 'Login successful',
      description: `Welcome back, ${userType}!`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleLoginError = (error) => {
    toast({
      title: 'Login failed',
      description: error.response?.data?.message || 'An error occurred during login.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    setIsLoading(false);
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
        <form onSubmit={is2FARequired ? handle2FASubmit : handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isDisabled={is2FARequired}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isDisabled={is2FARequired}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>User Type</FormLabel>
              <Select
                placeholder="Select user type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                isDisabled={is2FARequired}
              >
                <option value="admin">Admin</option>
                <option value="farmer">Farmer</option>
                <option value="customer">Customer</option>
                <option value="community">Community</option>
              </Select>
            </FormControl>
            {is2FARequired && (
              <>
                <FormControl isRequired>
                  <FormLabel>2FA Type</FormLabel>
                  <Select
                    value={twoFAType}
                    onChange={(e) => setTwoFAType(e.target.value)}
                  >
                    <option value="sms">SMS</option>
                    <option value="app">Authenticator App</option>
                    <option value="email">Email</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>2FA Code</FormLabel>
                  {twoFAType === 'app' ? (
                    <HStack>
                      <PinInput value={twoFACode} onChange={(value) => setTwoFACode(value)}>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                      </PinInput>
                    </HStack>
                  ) : (
                    <Input
                      type="text"
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value)}
                      placeholder={`Enter ${twoFAType === 'sms' ? 'SMS' : 'Email'} code`}
                    />
                  )}
                </FormControl>
                <Button
                  onClick={() => setUseRecoveryCode(!useRecoveryCode)}
                  variant="link"
                  size="sm"
                >
                  {useRecoveryCode ? "Use 2FA Code" : "Use Recovery Code"}
                </Button>
                {useRecoveryCode && (
                  <FormControl isRequired>
                    <FormLabel>Recovery Code</FormLabel>
                    <Input
                      type="text"
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      placeholder="Enter recovery code"
                    />
                  </FormControl>
                )}
              </>
            )}
            <Checkbox
              isChecked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              isDisabled={is2FARequired}
            >
              Remember me
            </Checkbox>
            <Button
              type="submit"
              colorScheme="green"
              width="full"
              isLoading={isLoading}
              isDisabled={is2FARequired && !twoFACode && !recoveryCode}
            >
              {is2FARequired ? 'Verify 2FA' : 'Login'}
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}

export default LoginSystem;
