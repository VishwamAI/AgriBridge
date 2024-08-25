import React, { useContext } from 'react';
import {
  Box,
  Flex,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function Navbar() {
  const { isLoggedIn, logout, userType } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (userType) {
      case 'admin': return '/admin-dashboard';
      case 'farmer': return '/farmer-dashboard';
      case 'customer': return '/user-dashboard';
      case 'community': return '/community-dashboard';
      default: return '/';
    }
  };

  return (
    <Box bg="green.500" px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box fontWeight="bold">Growers-Gate</Box>

        <Flex display={{ base: 'none', md: 'flex' }}>
          <InputGroup>
            <Input placeholder="Search..." />
            <InputRightElement>
              <IconButton
                aria-label="Search"
                icon={<SearchIcon />}
                bg="transparent"
                _hover={{ bg: 'green.600' }}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>

        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              display={{ base: 'none', md: 'inline-flex' }}
            >
              Categories
            </MenuButton>
            <MenuList>
              <MenuItem>Fruits</MenuItem>
              <MenuItem>Vegetables</MenuItem>
              <MenuItem>Dairy</MenuItem>
              <MenuItem>Grains</MenuItem>
            </MenuList>
          </Menu>

          <Spacer />

          {isLoggedIn ? (
            <Menu>
              <MenuButton as={Button} ml={4}>
                My Account
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to={getDashboardLink()}>Dashboard</MenuItem>
                <MenuItem as={Link} to="/profile">Profile</MenuItem>
                <MenuItem as={Link} to="/orders">Orders</MenuItem>
                <MenuItem as={Link} to="/settings">Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button ml={4} as={Link} to="/login">
              Login
            </Button>
          )}

          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Open Menu"
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            ml={2}
          />
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <InputGroup>
                <Input placeholder="Search..." />
                <InputRightElement>
                  <IconButton
                    aria-label="Search"
                    icon={<SearchIcon />}
                    bg="transparent"
                    _hover={{ bg: 'green.100' }}
                  />
                </InputRightElement>
              </InputGroup>
              <Button as={Link} to="/">
                Home
              </Button>
              <Button as={Link} to="/products">
                Products
              </Button>
              <Button as={Link} to="/about">
                About Us
              </Button>
              <Button as={Link} to="/contact">
                Contact
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Navbar;
