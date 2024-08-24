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

function EntertainmentDashboard() {
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
          Entertainment Dashboard
        </Heading>
        <SimpleGrid columns={2} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Video Streaming</Heading>
            <Text mt={4}>Watch and manage your video content.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Video streaming')}>
              Explore Videos
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Social Media</Heading>
            <Text mt={4}>Connect with friends and share updates.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Social media')}>
              Open Feed
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Short-form Videos</Heading>
            <Text mt={4}>Create and watch short, engaging videos.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Short-form videos')}>
              Explore Shorts
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Photo Sharing</Heading>
            <Text mt={4}>Share and edit your photos with filters.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Photo sharing')}>
              Open Gallery
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Messaging</Heading>
            <Text mt={4}>Chat with friends in real-time.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Messaging')}>
              Open Chat
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Content Creation</Heading>
            <Text mt={4}>Create and submit your own content.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Content creation')}>
              Start Creating
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Live Streaming</Heading>
            <Text mt={4}>Start or watch live streams.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Live streaming')}>
              Go Live
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Recommendations</Heading>
            <Text mt={4}>Discover personalized content.</Text>
            <Button mt={4} colorScheme="green" onClick={() => handleAction('Recommendations')}>
              Explore
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default EntertainmentDashboard;
