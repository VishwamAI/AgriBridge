import React from 'react';
import { Box, Container, Text, Flex, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.100" py={4}>
      <Container maxW="container.xl">
        <Flex justifyContent="space-between" alignItems="center">
          <Text>&copy; 2023 AgriBridge. All rights reserved.</Text>
          <Flex>
            {/* Placeholder for footer links */}
            <Link href="#" mr={4}>About Us</Link>
            <Link href="#" mr={4}>Contact</Link>
            <Link href="#">Privacy Policy</Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
