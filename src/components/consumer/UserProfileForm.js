import React, { useState } from 'react';
import { Box, VStack, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react';

const UserProfileForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    location: '',
    bio: '',
    preferences: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input name="location" value={formData.location} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea name="bio" value={formData.bio} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Food Preferences</FormLabel>
          <Input name="preferences" value={formData.preferences} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="green">Save Profile</Button>
      </VStack>
    </Box>
  );
};

export default UserProfileForm;
