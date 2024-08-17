import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Flex,
  Text,
  Button,
  Input,
  IconButton,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { FaHome, FaShoppingBag, FaBox, FaUser, FaUsers } from 'react-icons/fa';
import axios from 'axios';

// Mock data for demonstration
const mockProducts = [
  { id: 1, name: 'Fresh Tomatoes', price: 2.99, farmer: 'John Doe' },
  { id: 2, name: 'Organic Eggs', price: 4.99, farmer: 'Jane Smith' },
  { id: 3, name: 'Homemade Jam', price: 6.99, farmer: 'Bob Johnson' },
];

const mockOrders = [
  { id: 101, items: ['Fresh Tomatoes', 'Organic Eggs'], status: 'In Progress' },
  { id: 102, items: ['Homemade Jam'], status: 'Delivered' },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userCredentials, setUserCredentials] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          // Verify token with backend
          const response = await axios.post('https://api.example.com/verify-token', { token });
          if (response.data.isValid) {
            setUserCredentials(response.data.user);
            setIsAuthenticated(true);
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          console.error('Token verification error:', error);
          localStorage.removeItem('userToken');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Simulating real-time notifications
    const notificationInterval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: `New product added: ${mockProducts[Math.floor(Math.random() * mockProducts.length)].name}`,
      };
      setNotifications(prev => [...prev, newNotification]);
      showNotificationToast(newNotification.message);
    }, 30000); // Every 30 seconds

    return () => clearInterval(notificationInterval);
  }, []);

  const showNotificationToast = (message) => {
    toast({
      title: 'Notification',
      description: message,
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    showNotificationToast(`Added ${product.name} to cart`);
  };

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://api.example.com/login', { username, password });
      if (response.data.token) {
        setUserCredentials(response.data);
        localStorage.setItem('userToken', response.data.token);
        setIsAuthenticated(true);
        showNotificationToast('Logged in successfully');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotificationToast(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const screens = {
    Home: (
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Welcome to Farm Fresh</Text>
        <Box p={5} shadow="md" borderWidth="1px">
          <Text fontSize="xl" mb={4}>Today's Highlights</Text>
          {mockProducts.map(product => (
            <Flex key={product.id} justify="space-between" align="center" mb={2}>
              <Text>{product.name} - ${product.price}</Text>
              <Button size="sm" colorScheme="green" onClick={() => addToCart(product)}>Add to Cart</Button>
            </Flex>
          ))}
        </Box>
      </VStack>
    ),
    Browse: (
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Browse Products</Text>
        <Input placeholder="Search products..." />
        {mockProducts.map(product => (
          <Box key={product.id} p={3} shadow="sm" borderWidth="1px">
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">{product.name}</Text>
                <Text fontSize="sm">by {product.farmer}</Text>
              </VStack>
              <Button colorScheme="green" onClick={() => addToCart(product)}>Add to Cart (${product.price})</Button>
            </Flex>
          </Box>
        ))}
      </VStack>
    ),
    Orders: (
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Your Orders</Text>
        {mockOrders.map(order => (
          <Box key={order.id} p={3} shadow="sm" borderWidth="1px">
            <Text fontWeight="bold">Order #{order.id}</Text>
            <Text>Items: {order.items.join(', ')}</Text>
            <Text>Status: {order.status}</Text>
          </Box>
        ))}
      </VStack>
    ),
    Sell: (
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Sell Your Products</Text>
        <Input placeholder="Product Name" />
        <Input placeholder="Price" type="number" />
        <Button colorScheme="blue">List Product</Button>
      </VStack>
    ),
    Community: (
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Community</Text>
        <Text>Connect with local farmers and customers!</Text>
        {/* Add community features here */}
      </VStack>
    ),
    Login: (
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Login</Text>
        <Input placeholder="Username" id="username" />
        <Input placeholder="Password" id="password" type="password" />
        <Button colorScheme="blue" onClick={() => {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          handleLogin(username, password);
        }}>Login</Button>
      </VStack>
    ),
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        {isLoading ? (
          <Spinner size="xl" />
        ) : isAuthenticated ? (
          <>
            <Flex justifyContent="flex-end" p={2}>
              <Button onClick={() => {
                setIsAuthenticated(false);
                setUserCredentials(null);
                localStorage.removeItem('userToken');
                setCurrentScreen('Home');
              }}>
                Logout
              </Button>
            </Flex>
            <Grid minH="100vh" p={3}>
              <VStack spacing={8}>
                {screens[currentScreen]}
              </VStack>
            </Grid>
            <Flex position="fixed" bottom={0} width="100%" justifyContent="space-around" bg="white" p={2} borderTop="1px" borderColor="gray.200">
              <IconButton icon={<FaHome />} onClick={() => setCurrentScreen('Home')} aria-label="Home" />
              <IconButton icon={<FaShoppingBag />} onClick={() => setCurrentScreen('Browse')} aria-label="Browse" />
              <IconButton icon={<FaBox />} onClick={() => setCurrentScreen('Orders')} aria-label="Orders" />
              <IconButton icon={<FaUser />} onClick={() => setCurrentScreen('Sell')} aria-label="Sell" />
              <IconButton icon={<FaUsers />} onClick={() => setCurrentScreen('Community')} aria-label="Community" />
            </Flex>
          </>
        ) : (
          screens['Login']
        )}
      </Box>
    </ChakraProvider>
  );
}
