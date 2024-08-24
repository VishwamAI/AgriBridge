import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Avatar,
  Flex,
  Spacer,
  Textarea,
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react';

function Profile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [bio, setBio] = useState('I am a farmer passionate about sustainable agriculture.');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (phoneNumber && !/^\+?[\d\s-]+$/.test(phoneNumber)) newErrors.phoneNumber = 'Phone number is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    // TODO: Implement actual profile update logic here
    console.log('Profile update submitted:', { name, email, bio, location, phoneNumber });

    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };

  return (
    <Box maxWidth="600px" margin="auto" mt={8} bg={bgColor} borderRadius="lg" p={6} boxShadow="md" borderWidth={1} borderColor={borderColor}>
      <VStack spacing={8} align="stretch">
        <Flex align="center" direction={{ base: 'column', md: 'row' }}>
          <Avatar size="2xl" name={name} src="https://github.com/shadcn.png" mb={{ base: 4, md: 0 }} />
          <Spacer />
          <Heading as="h1" size="xl" textAlign={{ base: 'center', md: 'right' }}>
            {isEditing ? 'Edit Profile' : 'My Profile'}
          </Heading>
        </Flex>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Optional"
                />
                <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Optional"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="green"
                width="full"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
              <Button
                width="full"
                onClick={() => setIsEditing(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </VStack>
          </form>
        ) : (
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg">
              <strong>Name:</strong> {name}
            </Text>
            <Text fontSize="lg">
              <strong>Email:</strong> {email}
            </Text>
            {phoneNumber && (
              <Text fontSize="lg">
                <strong>Phone:</strong> {phoneNumber}
              </Text>
            )}
            {location && (
              <Text fontSize="lg">
                <strong>Location:</strong> {location}
              </Text>
            )}
            <Text fontSize="lg">
              <strong>Bio:</strong> {bio}
            </Text>
            <Button
              onClick={() => setIsEditing(true)}
              colorScheme="green"
              width="full"
            >
              Edit Profile
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

export default Profile;
