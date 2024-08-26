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
  Progress,
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function FarmerDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [farmData, setFarmData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Simulating API call to fetch farm data
    setTimeout(() => {
      setFarmData({
        crops: ['Corn', 'Wheat', 'Soybeans'],
        yield: 1250,
        yieldChange: 5.4,
        weather: 'Sunny',
        inventory: 850,
        orders: 12,
        salesData: [
          { name: 'Jan', sales: 4000 },
          { name: 'Feb', sales: 3000 },
          { name: 'Mar', sales: 5000 },
          { name: 'Apr', sales: 4500 },
          { name: 'May', sales: 6000 },
          { name: 'Jun', sales: 5500 },
        ],
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
          Farmer Dashboard
        </Heading>
        {farmData ? (
          <>
            <SimpleGrid columns={[1, 2, 4]} spacing={10}>
              <Stat>
                <StatLabel>Current Yield</StatLabel>
                <StatNumber>{farmData.yield} bushels</StatNumber>
                <StatHelpText>
                  <StatArrow type={farmData.yieldChange > 0 ? 'increase' : 'decrease'} />
                  {farmData.yieldChange}%
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Weather</StatLabel>
                <StatNumber>{farmData.weather}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Inventory</StatLabel>
                <StatNumber>{farmData.inventory} units</StatNumber>
                <Progress value={(farmData.inventory / 1000) * 100} size="sm" colorScheme="green" />
              </Stat>
              <Stat>
                <StatLabel>Pending Orders</StatLabel>
                <StatNumber>{farmData.orders}</StatNumber>
              </Stat>
            </SimpleGrid>
            <Box height="300px">
              <Heading fontSize="xl" mb={4}>Sales Analytics</Heading>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={farmData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </>
        ) : (
          <Text>Loading farm data...</Text>
        )}
        <SimpleGrid columns={[1, 2]} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Inventory Management</Heading>
            <Text mt={4}>Manage your product inventory here.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Inventory management')}>
              Manage Inventory
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
            <Heading fontSize="xl">Profile Update</Heading>
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
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Analytics and Insights</Heading>
            <Text mt={4}>View detailed analytics and insights about your farm.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('View analytics')}>
              View Analytics
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default FarmerDashboard;
