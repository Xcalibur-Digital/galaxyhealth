import { rem } from '@mantine/core';

export const navigationStyles = (theme) => ({
  navbar: {
    backgroundColor: 'var(--mantine-color-dark-7)',
    height: '100vh',
    width: rem(250),
    padding: 'var(--mantine-spacing-md)'
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 'var(--mantine-spacing-md)',
    borderRadius: 'var(--mantine-radius-md)',
    transition: 'all 200ms ease',
    color: 'var(--mantine-color-dark-0)',
    
    '&:hover': {
      backgroundColor: 'var(--mantine-color-dark-6)',
    },

    '&[data-active="true"]': {
      backgroundColor: 'var(--mantine-color-blue-5)',
      color: 'var(--mantine-color-white)',
      
      '& .nav-icon': {
        color: 'var(--mantine-color-white)',
      }
    },

    '@media (max-width: 48em)': {
      padding: 'var(--mantine-spacing-xs)',
      borderRadius: 0,
      '&[data-active="true"]': {
        borderRadius: 0,
      }
    },
  },

  navIcon: {
    color: 'var(--mantine-color-dark-2)',
    marginRight: 'var(--mantine-spacing-sm)',
    
    '@media (max-width: 48em)': {
      marginRight: 0,
    }
  },

  navLabel: {
    '@media (max-width: 48em)': {
      fontSize: 'var(--mantine-font-size-xs)',
    }
  },

  mobileNav: {
    display: 'flex',
    flexDirection: 'column'
  },

  divider: {
    marginBottom: 'var(--mantine-spacing-xs)'
  }
}); 