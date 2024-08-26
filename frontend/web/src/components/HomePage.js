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
  useBreakpointValue,
  Stack,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg="green.500" color="white" py={{ base: 8, md: 16 }}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box flex={1} mr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
              <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={4}>
                Welcome to Growers-Gate
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} mb={6}>
                Connecting farmers and consumers for fresher, healthier produce
              </Text>
              <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                <Link to="/login">
                  <Button as="span" colorScheme="white" variant="outline" size={{ base: "md", md: "lg" }}>
                    Sign Up
                  </Button>
                </Link>
                <Link to="/about">
                  <Button as="span" colorScheme="green" size={{ base: "md", md: "lg" }}>
                    Learn More
                  </Button>
                </Link>
              </Stack>
            </Box>
            <Box flex={1} mt={{ base: 8, md: 0 }}>
              <Image src="/hero-image.jpg" alt="Fresh produce" borderRadius="md" w="full" />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Featured Products Carousel */}
      <Box py={{ base: 8, md: 16 }}>
        <Container maxW="container.xl">
          <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={8} textAlign="center">
            Featured Products
          </Heading>
          <FeaturedProductsCarousel />
        </Container>
      </Box>

      {/* About Us Section */}
      <Box bg="gray.100" py={{ base: 8, md: 16 }}>
        <Container maxW="container.xl">
          <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={8} textAlign="center">
            About Us
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} textAlign="center" maxW="2xl" mx="auto">
            Growers-Gate is a platform dedicated to connecting local farmers with consumers,
            promoting sustainable agriculture and providing access to fresh, high-quality produce.
          </Text>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={{ base: 8, md: 16 }}>
        <Container maxW="container.xl">
          <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={8} textAlign="center">
            How It Works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 8, md: 10 }}>
            <VStack>
              <Image src="/icon-farmer.png" alt="Farmer icon" boxSize={{ base: "80px", md: "100px" }} />
              <Heading as="h3" size={{ base: "md", md: "lg" }}>Farmers List Products</Heading>
              <Text textAlign="center" fontSize={{ base: "sm", md: "md" }}>Local farmers list their fresh produce on our platform.</Text>
            </VStack>
            <VStack>
              <Image src="/icon-consumer.png" alt="Consumer icon" boxSize={{ base: "80px", md: "100px" }} />
              <Heading as="h3" size={{ base: "md", md: "lg" }}>Consumers Order</Heading>
              <Text textAlign="center" fontSize={{ base: "sm", md: "md" }}>Customers browse and order directly from farmers.</Text>
            </VStack>
            <VStack>
              <Image src="/icon-delivery.png" alt="Delivery icon" boxSize={{ base: "80px", md: "100px" }} />
              <Heading as="h3" size={{ base: "md", md: "lg" }}>Fresh Delivery</Heading>
              <Text textAlign="center" fontSize={{ base: "sm", md: "md" }}>Products are delivered fresh from farm to table.</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box bg="gray.100" py={{ base: 8, md: 16 }}>
        <Container maxW="container.xl">
          <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={8} textAlign="center">
            What Our Users Say
          </Heading>
          {/* Add testimonials component here */}
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py={{ base: 8, md: 16 }}>
        <Container maxW="container.xl">
          <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={8} textAlign="center">
            Benefits of Using Growers-Gate
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 10 }}>
            <VStack align="start" spacing={4}>
              <Heading as="h3" size={{ base: "md", md: "lg" }}>For Farmers</Heading>
              <Text fontSize={{ base: "sm", md: "md" }}>• Direct access to customers</Text>
              <Text fontSize={{ base: "sm", md: "md" }}>• Higher profit margins</Text>
              <Text fontSize={{ base: "sm", md: "md" }}>• Reduced food waste</Text>
            </VStack>
            <VStack align="start" spacing={4}>
              <Heading as="h3" size={{ base: "md", md: "lg" }}>For Customers</Heading>
              <Text fontSize={{ base: "sm", md: "md" }}>• Fresh, locally sourced produce</Text>
              <Text fontSize={{ base: "sm", md: "md" }}>• Support local agriculture</Text>
              <Text fontSize={{ base: "sm", md: "md" }}>• Transparent food sourcing</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Newsletter Signup */}
      <Box bg="green.500" color="white" py={{ base: 8, md: 16 }}>
        <Container maxW="container.xl">
          <VStack spacing={4}>
            <Heading as="h2" size={{ base: "lg", md: "xl" }} textAlign="center">
              Stay Updated
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} textAlign="center">
              Subscribe to our newsletter for the latest updates and offers
            </Text>
            <Flex maxW="md" w="full" flexDirection={{ base: "column", sm: "row" }}>
              <Input placeholder="Enter your email" bg="white" color="black" mb={{ base: 2, sm: 0 }} />
              <IconButton
                colorScheme="green"
                aria-label="Subscribe"
                icon={<ArrowForwardIcon />}
                ml={{ base: 0, sm: 2 }}
                mt={{ base: 2, sm: 0 }}
              />
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={{ base: 8, md: 12 }}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 8, md: 4 }}>
            <VStack align="start">
              <Heading as="h3" size="sm">Quick Links</Heading>
              <Button variant="link" color="white" fontSize={{ base: "sm", md: "md" }}>Home</Button>
              <Button variant="link" color="white" fontSize={{ base: "sm", md: "md" }}>About</Button>
              <Button variant="link" color="white" fontSize={{ base: "sm", md: "md" }}>Products</Button>
              <Button variant="link" color="white" fontSize={{ base: "sm", md: "md" }}>Contact</Button>
            </VStack>
            <VStack align="start">
              <Heading as="h3" size="sm">For Farmers</Heading>
              <Button variant="link" color="white" fontSize={{ base: "sm", md: "md" }}>Join as Farmer</Button>
              <Button variant="link" color="white" fontSize={{ base: "sm", md: "md" }}>Farmer Resources</Button>
            </VStack>
            <VStack align="start">
              <Heading as="h3" size="sm">For Customers</Heading>
              <Button variant="link" color="white" fontSize={{ base: "sm", md: "md" }}>Find Local Produce</Button>
              <Button variant="link" color="white" fontSize={{ base: "sm", md: "md" }}>Cooking Tips</Button>
            </VStack>
            <VStack align="start">
              <Heading as="h3" size="sm">Connect With Us</Heading>
              {/* Add social media icons here */}
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;

const FeaturedProductsCarousel = () => {
  const [slider, setSlider] = React.useState(null);
  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '40px' });

  const cards = [
    { image: '/product1.jpg', title: 'Fresh Apples' },
    { image: '/product2.jpg', title: 'Organic Tomatoes' },
    { image: '/product3.jpg', title: 'Farm Eggs' },
    { image: '/product4.jpg', title: 'Local Honey' },
  ];

  const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box position="relative" height={{ base: "300px", md: "400px" }} width="full" overflow="hidden">
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <IconButton
        aria-label="left-arrow"
        variant="ghost"
        position="absolute"
        left={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickPrev()}
      >
        <ChevronLeftIcon boxSize={{ base: "24px", md: "40px" }} />
      </IconButton>
      <IconButton
        aria-label="right-arrow"
        variant="ghost"
        position="absolute"
        right={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickNext()}
      >
        <ChevronRightIcon boxSize={{ base: "24px", md: "40px" }} />
      </IconButton>
      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        {cards.map((card, index) => (
          <Box
            key={index}
            height={{ base: "300px", md: "400px" }}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundImage={`url(${card.image})`}
          >
            <Container size="container.lg" height={{ base: "300px", md: "400px" }} position="relative">
              <Stack
                spacing={6}
                w="full"
                maxW="lg"
                position="absolute"
                top="50%"
                transform="translate(0, -50%)"
              >
                <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}>
                  {card.title}
                </Heading>
              </Stack>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
