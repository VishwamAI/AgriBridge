import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Image,
  SimpleGrid,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg="green.500" color="white" py={16}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box flex={1} mr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
              <Heading as="h1" size="2xl" mb={4}>
                Welcome to Growers-Gate
              </Heading>
              <Text fontSize="xl" mb={6}>
                Connecting farmers and consumers for fresher, healthier produce
              </Text>
              <Button colorScheme="white" variant="outline" size="lg" mr={4}>
                Sign Up
              </Button>
              <Button colorScheme="green" size="lg">
                Learn More
              </Button>
            </Box>
            <Box flex={1}>
              <Image src="/hero-image.jpg" alt="Fresh produce" borderRadius="md" />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Featured Products Carousel */}
      <Box py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            Featured Products
          </Heading>
          {/* Add carousel component here */}
        </Container>
      </Box>

      {/* About Us Section */}
      <Box bg="gray.100" py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            About Us
          </Heading>
          <Text fontSize="lg" textAlign="center" maxW="2xl" mx="auto">
            Growers-Gate is a platform dedicated to connecting local farmers with consumers,
            promoting sustainable agriculture and providing access to fresh, high-quality produce.
          </Text>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            How It Works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <VStack>
              <Image src="/icon-farmer.png" alt="Farmer icon" boxSize="100px" />
              <Heading as="h3" size="lg">Farmers List Products</Heading>
              <Text textAlign="center">Local farmers list their fresh produce on our platform.</Text>
            </VStack>
            <VStack>
              <Image src="/icon-consumer.png" alt="Consumer icon" boxSize="100px" />
              <Heading as="h3" size="lg">Consumers Order</Heading>
              <Text textAlign="center">Customers browse and order directly from farmers.</Text>
            </VStack>
            <VStack>
              <Image src="/icon-delivery.png" alt="Delivery icon" boxSize="100px" />
              <Heading as="h3" size="lg">Fresh Delivery</Heading>
              <Text textAlign="center">Products are delivered fresh from farm to table.</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box bg="gray.100" py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            What Our Users Say
          </Heading>
          {/* Add testimonials component here */}
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            Benefits of Using Growers-Gate
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <VStack align="start">
              <Heading as="h3" size="lg">For Farmers</Heading>
              <Text>• Direct access to customers</Text>
              <Text>• Higher profit margins</Text>
              <Text>• Reduced food waste</Text>
            </VStack>
            <VStack align="start">
              <Heading as="h3" size="lg">For Customers</Heading>
              <Text>• Fresh, locally sourced produce</Text>
              <Text>• Support local agriculture</Text>
              <Text>• Transparent food sourcing</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Newsletter Signup */}
      <Box bg="green.500" color="white" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={4}>
            <Heading as="h2" size="xl" textAlign="center">
              Stay Updated
            </Heading>
            <Text fontSize="lg" textAlign="center">
              Subscribe to our newsletter for the latest updates and offers
            </Text>
            <Flex maxW="md" w="full">
              <Input placeholder="Enter your email" bg="white" color="black" />
              <IconButton
                colorScheme="green"
                aria-label="Subscribe"
                icon={<ArrowForwardIcon />}
                ml={2}
              />
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={8}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <VStack align="start">
              <Heading as="h3" size="md">Quick Links</Heading>
              <Button variant="link" color="white">Home</Button>
              <Button variant="link" color="white">About</Button>
              <Button variant="link" color="white">Products</Button>
              <Button variant="link" color="white">Contact</Button>
            </VStack>
            <VStack align="start">
              <Heading as="h3" size="md">For Farmers</Heading>
              <Button variant="link" color="white">Join as Farmer</Button>
              <Button variant="link" color="white">Farmer Resources</Button>
            </VStack>
            <VStack align="start">
              <Heading as="h3" size="md">For Customers</Heading>
              <Button variant="link" color="white">Find Local Produce</Button>
              <Button variant="link" color="white">Cooking Tips</Button>
            </VStack>
            <VStack align="start">
              <Heading as="h3" size="md">Connect With Us</Heading>
              {/* Add social media icons here */}
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
