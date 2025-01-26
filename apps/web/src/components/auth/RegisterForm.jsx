import React, { useState } from 'react';
import { TextInput, Button, Group, Box, Divider } from '@mantine/core';
import { authService } from '../../services/authService';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const user = await authService.register(formData);
      onSuccess(user);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={handleSubmit}>
        <TextInput
          required
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          mb="md"
        />
        <TextInput
          required
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          mb="md"
        />
        <TextInput
          required
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={error}
          mb="md"
        />
        <TextInput
          required
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          mb="md"
        />
        <TextInput
          required
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          mb="md"
        />
        <Group position="right">
          <Button type="submit" loading={loading}>
            Create Account
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default RegisterForm; 