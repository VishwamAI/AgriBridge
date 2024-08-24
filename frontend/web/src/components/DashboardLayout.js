import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, ShoppingCart, FileText, MessageSquare, Video, Settings, Bell, Search, LogOut } from 'lucide-react';
import { Box, Flex, VStack, Heading, Button, Input, useDisclosure, Avatar, AvatarBadge, Text, SimpleGrid, Card, CardHeader, CardBody } from '@chakra-ui/react';
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
        { id: 1, message: "New order received" },
        { id: 2, message: "Product stock low" },
      ]);
    }, 1000);
  }, []);

  const NavItem = ({ icon: Icon, label, to }) => (
    <li>
      <Link to={to} className="flex items-center p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-blue-600 transition-colors">
        <Icon size={20} className="mr-2" />
        {label}
      </Link>
    </li>
  );

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        bg="white"
        w={{ base: "full", md: 64 }}
        pos="fixed"
        h="full"
        {...(isOpen ? { display: "block" } : { display: { base: "none", md: "block" } })}
        zIndex={20}
        boxShadow="lg"
      >
        <Flex p={5} borderBottomWidth={1} alignItems="center" justifyContent="space-between">
          <Heading size="lg" color="blue.600">FarmConnect</Heading>
          <Button display={{ base: "block", md: "none" }} onClick={onClose} variant="ghost">
            <X size={24} />
          </Button>
        </Flex>
        <nav className="mt-4">
          <ul className="space-y-2 px-3">
            <NavItem icon={Home} label="Dashboard" to="/dashboard" />
            <NavItem icon={User} label="Profile" to="/profile" />
            <NavItem icon={ShoppingCart} label="Products" to="/farmer-dashboard" />
            <NavItem icon={FileText} label="Orders" to="/orders" />
            <NavItem icon={MessageSquare} label="Community" to="/community-dashboard" />
            <NavItem icon={Video} label="Entertainment" to="/entertainment-dashboard" />
            <NavItem icon={Settings} label="Settings" to="/settings" />
          </ul>
        </nav>
        <Box position="absolute" bottom={4} width="100%" px={4}>
          <Button leftIcon={<LogOut size={20} />} variant="outline" w="full">
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box ml={{ base: 0, md: 64 }} w="full">
        {/* Top Navigation */}
        <Flex bg="white" p={4} alignItems="center" boxShadow="sm">
          <Button display={{ base: "block", md: "none" }} onClick={onOpen} variant="ghost" mr={3}>
            <Menu size={24} />
          </Button>
          <Box position="relative" flex={1} maxW="400px">
            <Input placeholder="Search..." pl={10} />
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
              <Search size={20} color="gray.300" />
            </Box>
          </Box>
          <Flex alignItems="center" ml={4}>
            <Button variant="ghost" position="relative" mr={4}>
              <Bell size={20} />
              {notifications.length > 0 && (
                <Avatar size="xs" bg="red.500" color="white" position="absolute" top={-1} right={-1}>
                  <AvatarBadge boxSize="1.25em" bg="red.500" borderColor="white">
                    {notifications.length}
                  </AvatarBadge>
                </Avatar>
              )}
            </Button>
            <Avatar name="User Name" src="https://github.com/shadcn.png" size="sm" />
          </Flex>
        </Flex>

        {/* Dashboard Content */}
        <Box p={6} bg="gray.100" minH="calc(100vh - 64px)">
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
  );
};

export default DashboardLayout;
