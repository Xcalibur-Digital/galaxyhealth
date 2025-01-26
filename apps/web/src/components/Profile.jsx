import React, { useState } from 'react';
import { Box, TextInput, Button, Avatar, Group, Text } from '@mantine/core';
import { useUser } from '../contexts/UserContext';
import './Profile.css';

const Profile = ({ onClose }) => {
  const { user, login } = useUser();
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement profile update API call
      login({ ...user, ...formData });
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="profile-form">
      <Group mb="lg" className="profile-header">
        <Avatar src={user.photoURL} size={80} radius={40} />
        <Box>
          <Text size="lg" weight={500}>{user.firstName} {user.lastName}</Text>
          <Text size="sm" color="dimmed">{user.email}</Text>
        </Box>
      </Group>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          mb="md"
        />
        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          mb="md"
        />
        <TextInput
          label="Email"
          value={formData.email}
          disabled
          mb="md"
        />
        <TextInput
          label="Phone"
          value={formData.phone}
          onChange={handleChange('phone')}
          mb="md"
        />
        <Group position="right" mt="xl">
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Changes</Button>
        </Group>
      </form>
    </Box>
  );
};

export default Profile; 