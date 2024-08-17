import React, { useState } from 'react';
import { Box, VStack, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react';

const FarmerProfileForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    farmName: '',
    farmerName: '',
    location: '',
    bio: '',
    specialties: '',
    contactEmail: '',
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
          <FormLabel>Farm Name</FormLabel>
          <Input name="farmName" value={formData.farmName} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Farmer Name</FormLabel>
          <Input name="farmerName" value={formData.farmerName} onChange={handleChange} />
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
          <FormLabel>Specialties</FormLabel>
          <Input name="specialties" value={formData.specialties} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Contact Email</FormLabel>
          <Input name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} />
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

export default FarmerProfileForm;
