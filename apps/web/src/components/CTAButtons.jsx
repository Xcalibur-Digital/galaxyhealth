import React from 'react';
import { Button, Group } from '@mantine/core';
import './CTAButtons.css'; // Import your CSS file for additional styling

const CTAButtons = () => {
  return (
    <div className="cta-buttons">
      <Group position="center" spacing="md">
        <Button
          className="sign-in-button"
          radius="md"
          size="lg"
          styles={(theme) => ({
            root: {
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              boxShadow: theme.shadows.md,
              '&:hover': {
                backgroundColor: theme.fn.darken('#1E3A8A', 0.1),
              },
            },
          })}
        >
          Sign In
        </Button>
        <Button
          className="create-account-button"
          radius="md"
          size="lg"
          styles={(theme) => ({
            root: {
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              boxShadow: theme.shadows.md,
              '&:hover': {
                backgroundColor: theme.fn.darken('#10B981', 0.1),
              },
            },
          })}
        >
          Start Your Health Journey
        </Button>
      </Group>
      <div className="quick-access">
        <a href="/emergency-access" className="emergency-access">Emergency Access</a>
        <a href="/privacy-policy" className="privacy-policy">Privacy Policy</a>
      </div>
    </div>
  );
};

export default CTAButtons; 