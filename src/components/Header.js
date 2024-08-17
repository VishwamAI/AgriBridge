import React from 'react';
import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="green.500" py={4}>
      <Flex maxW="container.xl" mx="auto" align="center">
        <Heading color="white">Growers' Gate</Heading>
        <Spacer />
        <Box>
          {/* Placeholder for navigation links */}
          <Button colorScheme="whiteAlpha" mr={2}>Home</Button>
          <Button colorScheme="whiteAlpha" mr={2}>Products</Button>
          <Button colorScheme="whiteAlpha">Login</Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
