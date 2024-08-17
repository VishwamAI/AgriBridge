import React from 'react';
import { Box, Heading, Text, VStack, HStack, Avatar } from '@chakra-ui/react';
import UserProfileForm from '../components/consumer/UserProfileForm';
import { useProfile } from '../hooks/useProfile';

const UserProfilePage = () => {
  const { profile, updateProfile, loading, error } = useProfile('user');

  const handleSubmit = async (formData) => {
    await updateProfile(formData);
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error.message}</Box>;

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <HStack>
          <Avatar size="2xl" name={profile.name} src={profile.avatarUrl} />
          <VStack align="start">
            <Heading as="h1" size="xl">{profile.name}</Heading>
            <Text fontSize="lg">{profile.location}</Text>
          </VStack>
        </HStack>
        <Box>
          <Heading as="h2" size="lg" mb={4}>User Profile</Heading>
          <UserProfileForm initialData={profile} onSubmit={handleSubmit} />
        </Box>
      </VStack>
    </Box>
  );
};

export default UserProfilePage;
