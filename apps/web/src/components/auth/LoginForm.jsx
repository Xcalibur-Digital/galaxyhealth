import React, { useState } from 'react';
import { TextInput, Button, Group, Box, Divider } from '@mantine/core';
import { authService } from '../../services/authService';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await authService.login(email, password);
      onSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.handleGoogleAuth();
      onSuccess(user);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <Button
        fullWidth
        variant="outline"
        onClick={handleGoogleLogin}
        mb="md"
        leftIcon={<img src="/google-icon.svg" alt="Google" width={20} />}
      >
        Continue with Google
      </Button>
      
      <Divider label="Or" labelPosition="center" mb="md" />
      
      <form onSubmit={handleSubmit}>
        <TextInput
          required
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          mb="md"
        />
        <TextInput
          required
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb="md"
        />
        <Group position="right">
          <Button type="submit" loading={loading}>
            Sign In
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default LoginForm; 