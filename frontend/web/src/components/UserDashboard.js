import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';

function UserDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Simulating API call to fetch user data
    setTimeout(() => {
      setUserData({
        name: 'John Doe',
        ordersCount: 5,
        cartItems: 3,
        reviewsCount: 2,
        wishlistCount: 7,
      });
    }, 1000);
  }, []);

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
    <Box maxWidth="1200px" margin="auto" mt={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          User Dashboard
        </Heading>
        {userData ? (
          <SimpleGrid columns={[1, 2, 4]} spacing={10}>
            <Stat>
              <StatLabel>Orders</StatLabel>
              <StatNumber>{userData.ordersCount}</StatNumber>
              <StatHelpText>Active orders</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Cart Items</StatLabel>
              <StatNumber>{userData.cartItems}</StatNumber>
              <StatHelpText>Items in your cart</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Reviews</StatLabel>
              <StatNumber>{userData.reviewsCount}</StatNumber>
              <StatHelpText>Your product reviews</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Wishlist</StatLabel>
              <StatNumber>{userData.wishlistCount}</StatNumber>
              <StatHelpText>Saved items</StatHelpText>
            </Stat>
          </SimpleGrid>
        ) : (
          <Text>Loading user data...</Text>
        )}
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
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
            <Heading fontSize="xl">Payment Methods</Heading>
            <Text mt={4}>Manage your payment methods.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Payment management')}>
              Manage Payments
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">My Wishlist</Heading>
            <Text mt={4}>View and manage your wishlist.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Wishlist management')}>
              Manage Wishlist
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

export default UserDashboard;
