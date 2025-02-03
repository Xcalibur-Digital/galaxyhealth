import React, { createContext, useContext, useState } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';

const ThemeContext = createContext();

export const theme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'blue',
  colors: {
    dark: [
      '#C1C2C5', // 0
      '#A6A7AB', // 1
      '#909296', // 2
      '#5C5F66', // 3
      '#373A40', // 4
      '#2C2E33', // 5
      '#25262B', // 6
      '#1A1B1E', // 7
      '#141517', // 8
      '#101113', // 9
    ],
  },
  shadows: {
    md: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
    lg: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'md',
      },
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        },
      }),
    },
    MantineDataTable: {
      defaultProps: {
        highlightOnHover: true,
        withBorder: true,
        borderRadius: 'sm',
        horizontalSpacing: 'md',
        verticalSpacing: 'sm',
        fontSize: 'sm'
      },
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        },
        header: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          fontWeight: 600
        },
        table: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        }
      })
    },
    AppShell: {
      styles: (theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },
      }),
    },
    NavLink: {
      styles: (theme) => ({
        root: {
          '&[data-active=true]': {
            backgroundColor: theme.colors.blue[7],
          },
          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        },
      }),
    },
    Paper: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        },
      }),
    },
    ThemeIcon: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      }),
    },
  },
});

export const ThemeProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState('dark');

  const toggleColorScheme = (value) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    localStorage.setItem('theme', nextColorScheme);
  };

  return (
    <MantineProvider
      theme={{
        ...theme,
        colorScheme,
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      {children}
    </MantineProvider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 