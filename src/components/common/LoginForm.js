import React, { useState } from 'react';
import { Box, VStack, FormControl, FormLabel, Input, Button, Text, useToast, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ email, password, userType });
    } catch (error) {
      toast({
        title: t('loginFailed'),
        description: error.message || t('loginErrorMessage'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%" maxWidth="400px">
      <VStack spacing={4}>
        <FormControl id="email" isRequired>
          <FormLabel>{t('email')}</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>{t('password')}</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="userType" isRequired>
          <FormLabel>{t('userType')}</FormLabel>
          <Select
            placeholder={t('selectUserType')}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="farmer">{t('farmer')}</option>
            <option value="consumer">{t('consumer')}</option>
          </Select>
        </FormControl>
        <Button
          type="submit"
          colorScheme="brand"
          width="100%"
          isLoading={isLoading}
        >
          {t('login')}
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginForm;
