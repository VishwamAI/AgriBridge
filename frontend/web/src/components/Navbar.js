import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating login state
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                <MenuItem>Profile</MenuItem>
                <MenuItem>Orders</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem onClick={() => setIsLoggedIn(false)}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button ml={4} onClick={() => setIsLoggedIn(true)}>
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
