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
} from '@chakra-ui/react';

function Profile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [bio, setBio] = useState('I am a farmer passionate about sustainable agriculture.');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual profile update logic here
    console.log('Profile update submitted:', { name, email, bio });

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
    <Box maxWidth="600px" margin="auto" mt={8}>
      <VStack spacing={8} align="stretch">
        <Flex align="center">
          <Avatar size="2xl" name={name} src="https://bit.ly/broken-link" />
          <Spacer />
          <Heading as="h1" size="xl">
            {isEditing ? 'Edit Profile' : 'My Profile'}
          </Heading>
        </Flex>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
