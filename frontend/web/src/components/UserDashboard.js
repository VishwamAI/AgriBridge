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

function UserDashboard() {
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
          User Dashboard
        </Heading>
        <SimpleGrid columns={2} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">My Profile</Heading>
            <Text mt={4}>Manage your personal information.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Profile management')}>
              Manage Profile
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">My Orders</Heading>
            <Text mt={4}>View and manage your orders.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Order management')}>
              Manage Orders
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">My Cart</Heading>
            <Text mt={4}>View and manage items in your cart.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Cart management')}>
              View Cart
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">My Reviews</Heading>
            <Text mt={4}>Manage your product reviews.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Review management')}>
              Manage Reviews
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Support</Heading>
            <Text mt={4}>Get help and support for your account.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Support request')}>
              Contact Support
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Payment Methods</Heading>
            <Text mt={4}>Manage your payment methods.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Payment management')}>
              Manage Payments
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default UserDashboard;
