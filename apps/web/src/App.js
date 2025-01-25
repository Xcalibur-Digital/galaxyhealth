import React from 'react';
import { MantineProvider } from '@mantine/core';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  return (
    <MantineProvider theme={{
      colorScheme: 'dark',
      colors: {
        primary: ['#00F5D4'],
        secondary: ['#0496FF'],
      }
    }}>
      <MainLayout />
    </MantineProvider>
  );
}

export default App;
