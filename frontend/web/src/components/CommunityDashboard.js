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

function CommunityDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Simulating API call to fetch community data
    setTimeout(() => {
      setCommunityData({
        name: 'Green Valley Community',
        membersCount: 150,
        productsCount: 75,
        eventsCount: 5,
        forumPostsCount: 120,
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
          Community Dashboard
        </Heading>
        {communityData ? (
          <SimpleGrid columns={[1, 2, 4]} spacing={10}>
            <Stat>
              <StatLabel>Members</StatLabel>
              <StatNumber>{communityData.membersCount}</StatNumber>
              <StatHelpText>Active community members</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Products</StatLabel>
              <StatNumber>{communityData.productsCount}</StatNumber>
              <StatHelpText>Listed community products</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Events</StatLabel>
              <StatNumber>{communityData.eventsCount}</StatNumber>
              <StatHelpText>Upcoming community events</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Forum Posts</StatLabel>
              <StatNumber>{communityData.forumPostsCount}</StatNumber>
              <StatHelpText>Active discussions</StatHelpText>
            </Stat>
          </SimpleGrid>
        ) : (
          <Text>Loading community data...</Text>
        )}
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
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
            <Heading fontSize="xl">Community Forum</Heading>
            <Text mt={4}>Participate in community discussions.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Forum management')}>
              View Forum
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Event Management</Heading>
            <Text mt={4}>Organize and manage community events.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Event management')}>
              Manage Events
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Resource Sharing</Heading>
            <Text mt={4}>Share and access community resources.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Resource management')}>
              Manage Resources
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Collaboration Tools</Heading>
            <Text mt={4}>Access community collaboration tools.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Collaboration tools')}>
              View Tools
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Community Support</Heading>
            <Text mt={4}>Get help and support for your community.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Support request')}>
              Contact Support
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default CommunityDashboard;
