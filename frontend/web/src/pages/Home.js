import React from 'react';
import { Box, Container, Heading, Text, Button, VStack, HStack, Image } from '@chakra-ui/react';

const Home = () => {
  return (
    <Box>
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} alignItems="flex-start">
          <Heading as="h1" size="2xl" color="green.600">
            Welcome to Growers-Gate
          </Heading>
          <Text fontSize="xl">
            Connecting farmers and consumers for a sustainable future. Fresh, local produce at your fingertips.
          </Text>
          <HStack spacing={4}>
            <Button colorScheme="green" size="lg">
              Sign Up
            </Button>
            <Button colorScheme="green" variant="outline" size="lg">
              Learn More
            </Button>
          </HStack>
          <Image src="/hero-image.jpg" alt="Fresh produce" borderRadius="md" />
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
