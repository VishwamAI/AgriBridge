import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, ShoppingCart, FileText, MessageSquare, Video, Settings, Bell, Search, LogOut, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Box, Flex, VStack, Heading, Button, Input, useDisclosure, Avatar, AvatarBadge, Text, SimpleGrid, Card, CardHeader, CardBody, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow, IconButton } from '@chakra-ui/react';
import { InfoIcon, WarningIcon, CheckIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const DashboardLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulating fetching notifications
    setTimeout(() => {
      setNotifications([
        { id: 1, message: "New order received", type: "info", read: false },
        { id: 2, message: "Product stock low", type: "warning", read: false },
        { id: 3, message: "Payment failed", type: "error", read: false },
      ]);
    }, 1000);
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const NavItem = ({ icon: Icon, label, to }) => (
    <Box as="li" listStyleType="none">
      <Link to={to}>
        <Button
          leftIcon={<Icon size={20} />}
          variant="ghost"
          justifyContent="flex-start"
          width="100%"
          py={2}
          _hover={{ bg: 'gray.100', color: 'blue.600' }}
          transition="all 0.3s"
        >
          {label}
        </Button>
      </Link>
    </Box>
  );

  return (
    <Flex flexDirection="column" h="100vh">
      {/* Top Navigation */}
      <Flex bg="white" p={4} alignItems="center" justifyContent="space-between" boxShadow="sm">
        <Heading size="lg" color="blue.600">FarmConnect</Heading>
        <Flex alignItems="center">
          <Box position="relative" mr={4}>
            <Input
              placeholder="Search..."
              pl={10}
              pr={4}
              py={2}
              borderRadius="full"
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              _focus={{ bg: "white", boxShadow: "outline" }}
              transition="all 0.3s"
            />
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
              <Search size={20} color="gray.500" />
            </Box>
          </Box>
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Notifications"
                icon={<Bell size={20} />}
                variant="ghost"
                position="relative"
                mr={4}
              >
                {notifications.filter(n => !n.read).length > 0 && (
                  <Avatar size="xs" bg="red.500" color="white" position="absolute" top={-1} right={-1}>
                    <AvatarBadge boxSize="1.25em" bg="red.500" borderColor="white">
                      {notifications.filter(n => !n.read).length}
                    </AvatarBadge>
                  </Avatar>
                )}
              </IconButton>
            </PopoverTrigger>
            <PopoverContent width="300px">
              <PopoverArrow />
              <PopoverBody>
                {notifications.length > 0 ? (
                  <VStack align="stretch" spacing={2}>
                    {notifications.map((notification) => (
                      <Flex key={notification.id} align="center" justify="space-between">
                        <Flex align="center">
                          {notification.type === 'info' && <InfoIcon color="blue.500" mr={2} />}
                          {notification.type === 'warning' && <WarningIcon color="orange.500" mr={2} />}
                          {notification.type === 'error' && <WarningIcon color="red.500" mr={2} />}
                          <Text fontSize="sm" fontWeight={notification.read ? "normal" : "bold"}>
                            {notification.message}
                          </Text>
                        </Flex>
                        <IconButton
                          size="xs"
                          icon={<CheckIcon />}
                          aria-label="Mark as read"
                          onClick={() => markNotificationAsRead(notification.id)}
                        />
                      </Flex>
                    ))}
                    <Button size="sm" onClick={clearAllNotifications} mt={2}>
                      Clear All
                    </Button>
                  </VStack>
                ) : (
                  <Text>No new notifications</Text>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Avatar name="User Name" src="https://github.com/shadcn.png" size="sm" />
        </Flex>
      </Flex>

      <Flex flex={1}>
        {/* Sidebar */}
        <Box
          bg="white"
          w={{ base: "full", sm: "200px", md: "240px", lg: "280px" }}
          pos="fixed"
          h="calc(100vh - 64px)"
          top="64px"
          left={0}
          display={{ base: isOpen ? "block" : "none", md: "block" }}
          zIndex={20}
          boxShadow="lg"
          transition="all 0.3s"
        >
          <VStack as="nav" spacing={4} align="stretch" mt={6}>
            <NavItem icon={Home} label="Dashboard" to="/dashboard" />
            <NavItem icon={User} label="Profile" to="/profile" />
            <NavItem icon={ShoppingCart} label="Products" to="/farmer-dashboard" />
            <NavItem icon={FileText} label="Orders" to="/orders" />
            <NavItem icon={MessageSquare} label="Community" to="/community-dashboard" />
            <NavItem icon={Video} label="Entertainment" to="/entertainment-dashboard" />
            <NavItem icon={Settings} label="Settings" to="/settings" />
          </VStack>
          <Box position="absolute" bottom={4} width="100%" px={4}>
            <Button leftIcon={<LogOut size={20} />} variant="outline" w="full">
              Logout
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box ml={{ base: 0, sm: "200px", md: "240px", lg: "280px" }} w="full" transition="margin-left 0.3s" mt="64px">
          <Box p={6} bg="gray.100" minH="calc(100vh - 128px)">
            <Heading mb={6}>Dashboard</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              <Card>
                <CardHeader>
                  <Heading size="md">Sales Overview</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="200px">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#3182CE" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <Heading size="md">Recent Orders</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between">
                      <Text>Order #1234</Text>
                      <Text fontWeight="bold" color="green.500">$150.00</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Order #1235</Text>
                      <Text fontWeight="bold" color="green.500">$89.99</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Order #1236</Text>
                      <Text fontWeight="bold" color="green.500">$275.50</Text>
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <Heading size="md">Quick Actions</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3}>
                    <Button colorScheme="blue" w="full">Add New Product</Button>
                    <Button variant="outline" w="full">View Reports</Button>
                    <Button variant="ghost" w="full">Manage Inventory</Button>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
