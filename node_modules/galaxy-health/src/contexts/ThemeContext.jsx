import React, { createContext, useContext, useState, useEffect } from 'react';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleColorScheme = (value) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    localStorage.setItem('theme', nextColorScheme);
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        theme={{
          colorScheme,
          colors: {
            // Custom colors for both themes
            brand: ['#6E2B81', '#8A3A9B', '#B82C5D', '#8A2147'],
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 