import React, { useState } from 'react';
import { TextInput, Button, Group, Box, Divider, Stack } from '@mantine/core';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { IconBrandGoogle } from '@tabler/icons-react';

const LoginForm = ({ onGoogleSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <Stack spacing="md">
        <Button 
          leftIcon={<IconBrandGoogle size={16} />}
          variant="default"
          onClick={onGoogleSignIn}
          fullWidth
        >
          Continue with Google
        </Button>
      </Stack>
      
      <Divider label="Or" labelPosition="center" mb="md" />
      
      <form onSubmit={handleEmailLogin}>
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