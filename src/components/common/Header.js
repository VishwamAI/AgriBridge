import React, { useState } from 'react';
import { Box, Flex, Heading, Spacer, Button, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, InfoIcon, ViewIcon, HamburgerIcon, ChatIcon, SettingsIcon } from '@chakra-ui/icons';

const Header = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <Box bg="green.500" py={4}>
      <Flex maxW="container.xl" mx="auto" alignItems="center" px={4}>
        <Heading as="h1" size="lg" color="white">
          <Link to="/">Growers' Gate</Link>
        </Heading>
        <Spacer />
        <Flex alignItems="center">
          <form onSubmit={handleSearch}>
            <InputGroup size="sm" mr={4}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="white"
                _placeholder={{ color: 'gray.400' }}
              />
            </InputGroup>
          </form>
          <Button
            as={Link}
            to="/"
            variant="headerButton"
            isActive={location.pathname === '/'}
            mr={2}
            leftIcon={<InfoIcon />}
          >
            Home
          </Button>
          <Button
            as={Link}
            to="/user-dashboard"
            variant="headerButton"
            isActive={location.pathname === '/user-dashboard'}
            mr={2}
            leftIcon={<ViewIcon />}
          >
            User Dashboard
          </Button>
          <Button
            as={Link}
            to="/farmer-dashboard"
            variant="headerButton"
            isActive={location.pathname === '/farmer-dashboard'}
            mr={2}
            leftIcon={<ViewIcon />}
          >
            Farmer Dashboard
          </Button>
          <Button
            as={Link}
            to="/marketplace"
            variant="headerButton"
            isActive={location.pathname === '/marketplace'}
            mr={2}
            leftIcon={<HamburgerIcon />}
          >
            Marketplace
          </Button>
          <Button
            as={Link}
            to="/community"
            variant="headerButton"
            isActive={location.pathname === '/community'}
            mr={2}
            leftIcon={<ChatIcon />}
          >
            Community
          </Button>
          <Button
            as={Link}
            to="/payment"
            variant="headerButton"
            isActive={location.pathname === '/payment'}
            leftIcon={<SettingsIcon />}
          >
            Payment Method
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
