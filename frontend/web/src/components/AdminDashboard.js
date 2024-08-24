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

function AdminDashboard() {
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
          Admin Dashboard
        </Heading>
        <SimpleGrid columns={2} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Product Management</Heading>
            <Text mt={4}>Manage all product listings across the platform.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Product management')}>
              Manage Products
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Order Management</Heading>
            <Text mt={4}>View and manage all orders in the system.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Order management')}>
              Manage Orders
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">User Management</Heading>
            <Text mt={4}>Manage user accounts and permissions.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('User management')}>
              Manage Users
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Support</Heading>
            <Text mt={4}>Handle support requests and issues.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Support management')}>
              Manage Support
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default AdminDashboard;
