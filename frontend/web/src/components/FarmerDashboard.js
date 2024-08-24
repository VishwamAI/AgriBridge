import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useToast,
} from '@chakra-ui/react';

function FarmerDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAction = (action) => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `${action} action`,
        description: `${action} action completed successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 1000);
  };

  return (
    <Box maxWidth="800px" margin="auto" mt={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Farmer Dashboard
        </Heading>
        <SimpleGrid columns={2} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">My Products</Heading>
            <Text mt={4}>Manage your product listings here.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Product management')}>
              Manage Products
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Orders</Heading>
            <Text mt={4}>View and manage incoming orders.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Order management')}>
              Manage Orders
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">My Profile</Heading>
            <Text mt={4}>Update your farmer profile information.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Profile update')}>
              Update Profile
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Support</Heading>
            <Text mt={4}>Get help and support for your account.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Support request')}>
              Contact Support
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default FarmerDashboard;
