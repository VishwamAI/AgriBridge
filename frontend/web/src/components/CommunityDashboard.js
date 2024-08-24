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

function CommunityDashboard() {
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
          Community Dashboard
        </Heading>
        <SimpleGrid columns={2} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Profile</Heading>
            <Text mt={4}>Manage your community profile information.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Profile management')}>
              Manage Profile
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Products</Heading>
            <Text mt={4}>Manage community products and listings.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Product management')}>
              Manage Products
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Orders</Heading>
            <Text mt={4}>View and manage community orders.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Order management')}>
              Manage Orders
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Cart</Heading>
            <Text mt={4}>View and manage community cart items.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Cart management')}>
              View Cart
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Checkout</Heading>
            <Text mt={4}>Manage community checkout process.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Checkout process')}>
              Checkout
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Payments</Heading>
            <Text mt={4}>Manage community payment methods.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Payment management')}>
              Manage Payments
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Reviews</Heading>
            <Text mt={4}>Manage community product reviews.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Review management')}>
              Manage Reviews
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Support</Heading>
            <Text mt={4}>Get help and support for your community.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Support request')}>
              Contact Support
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Logout</Heading>
            <Text mt={4}>Logout from your community account.</Text>
            <Button mt={4} colorScheme="red" onClick={() => handleAction('Logout')}>
              Logout
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default CommunityDashboard;
