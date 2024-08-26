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
} from '@chakra-ui/react';

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Simulating API call to fetch admin data
    setTimeout(() => {
      setAdminData({
        totalProducts: 150,
        totalOrders: 75,
        totalUsers: 500,
        openSupportTickets: 12,
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
          Admin Dashboard
        </Heading>
        {adminData ? (
          <SimpleGrid columns={[1, 2, 4]} spacing={10}>
            <Stat>
              <StatLabel>Total Products</StatLabel>
              <StatNumber>{adminData.totalProducts}</StatNumber>
              <StatHelpText>Active listings</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Total Orders</StatLabel>
              <StatNumber>{adminData.totalOrders}</StatNumber>
              <StatHelpText>Processed orders</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>{adminData.totalUsers}</StatNumber>
              <StatHelpText>Registered users</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Open Support Tickets</StatLabel>
              <StatNumber>{adminData.openSupportTickets}</StatNumber>
              <StatHelpText>Pending requests</StatHelpText>
            </Stat>
          </SimpleGrid>
        ) : (
          <Text>Loading admin data...</Text>
        )}
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
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
            <Heading fontSize="xl">Support Management</Heading>
            <Text mt={4}>Handle support requests and issues.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Support management')}>
              Manage Support
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Analytics and Reporting</Heading>
            <Text mt={4}>View detailed analytics and generate reports.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Analytics and reporting')}>
              View Analytics
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default AdminDashboard;
