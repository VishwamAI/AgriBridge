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

function SocialMediaIntegration() {
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
          Social Media Integration
        </Heading>
        <SimpleGrid columns={2} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Facebook</Heading>
            <Text mt={4}>Connect and share on Facebook.</Text>
            <Button mt={4} colorScheme="facebook" onClick={() => handleAction('Facebook integration')}>
              Connect Facebook
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Twitter</Heading>
            <Text mt={4}>Tweet and follow on Twitter.</Text>
            <Button mt={4} colorScheme="twitter" onClick={() => handleAction('Twitter integration')}>
              Connect Twitter
            </Button>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">Instagram</Heading>
            <Text mt={4}>Share photos and stories on Instagram.</Text>
            <Button mt={4} colorScheme="pink" onClick={() => handleAction('Instagram integration')}>
              Connect Instagram
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default SocialMediaIntegration;
