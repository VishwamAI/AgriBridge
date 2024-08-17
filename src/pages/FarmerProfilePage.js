import React from 'react';
import { Box, Heading, Text, VStack, HStack, Avatar } from '@chakra-ui/react';
import FarmerProfileForm from '../components/farmer/FarmerProfileForm';
import { useProfile } from '../hooks/useProfile';

const FarmerProfilePage = () => {
  const { profile, updateProfile, loading, error } = useProfile('farmer');

  const handleSubmit = async (formData) => {
    await updateProfile(formData);
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error.message}</Box>;

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <HStack>
          <Avatar size="2xl" name={profile.farmerName} src={profile.avatarUrl} />
          <VStack align="start">
            <Heading as="h1" size="xl">{profile.farmName}</Heading>
            <Text fontSize="lg">{profile.location}</Text>
          </VStack>
        </HStack>
        <Box>
          <Heading as="h2" size="lg" mb={4}>Farmer Profile</Heading>
          <FarmerProfileForm initialData={profile} onSubmit={handleSubmit} />
        </Box>
      </VStack>
    </Box>
  );
};

export default FarmerProfilePage;
