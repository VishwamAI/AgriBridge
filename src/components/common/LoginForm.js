import React, { useState } from 'react';
import { Box, VStack, FormControl, FormLabel, Input, Button, Text, useToast, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ username, password, userType });
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
    <Box as="form" onSubmit={handleSubmit} width="100%" role="form">
      <VStack spacing={4}>
        <FormControl id="username" isRequired>
          <FormLabel htmlFor="username">{t('username')}</FormLabel>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel htmlFor="password">{t('password')}</FormLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="userType" isRequired>
          <FormLabel htmlFor="userType">{t('userType')}</FormLabel>
          <Select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            placeholder={t('selectUserType')}
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
      <Text mt={4} fontSize="sm" color="gray.500">
        {t('limitedAccessNote')}
      </Text>
    </Box>
  );
};

export default LoginForm;
