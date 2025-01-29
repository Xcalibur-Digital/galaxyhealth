import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Navbar, Stack, Box, Text, Group, Divider } from '@mantine/core';
import { 
  IconHome, 
  IconUsers, 
  IconCalendar, 
  IconSettings, 
  IconChartBar, 
  IconCoin, 
  IconDatabase, 
  IconHistory 
} from '@tabler/icons-react';
import { createStyles } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'width 200ms ease',
    
    [theme.fn.smallerThan('sm')]: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'auto',
      width: '100%',
      zIndex: 100,
      borderTop: `1px solid ${theme.colors.gray[2]}`,
    },
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    transition: 'all 200ms ease',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    '&[data-active="true"]': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: 'blue' }).background,
      color: theme.fn.variant({ variant: 'light', color: 'blue' }).color,
      
      '& .nav-icon': {
        color: theme.fn.variant({ variant: 'light', color: 'blue' }).color,
      }
    },

    [theme.fn.smallerThan('sm')]: {
      padding: theme.spacing.xs,
      borderRadius: 0,
      '&[data-active="true"]': {
        borderRadius: 0,
      }
    },
  },

  navIcon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
    
    [theme.fn.smallerThan('sm')]: {
      marginRight: 0,
    }
  },

  navLabel: {
    [theme.fn.smallerThan('sm')]: {
      fontSize: theme.fontSizes.xs,
    }
  },

  mobileNav: {
    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    }
  },

  divider: {
    margin: `${theme.spacing.md}px 0`,
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    }
  }
}));

const Navigation = () => {
  const { classes } = useStyles();
  const location = useLocation();

  const navigationItems = [
    { id: 'dashboard', icon: IconHome, label: 'Home', to: '/dashboard' },
    { id: 'patients', icon: IconUsers, label: 'Patients', to: '/patients' },
    { id: 'performance', icon: IconChartBar, label: 'Performance', to: '/performance' },
    { id: 'ehr-alerts', icon: IconDatabase, label: 'EHR Alerts', to: '/ehr-alerts' },
    { id: 'context', icon: IconHistory, label: 'Context History', to: '/patient-context' },
  ];

  const settingsItem = {
    id: 'settings',
    icon: IconSettings,
    label: 'Settings',
    to: '/settings'
  };

  const isActiveRoute = (path) => location.pathname === path;

  const navItemVariants = {
    initial: {
      opacity: 0,
      x: -20
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const NavItem = ({ icon: Icon, label, to, index, id }) => (
    <motion.div
      key={id}
      variants={navItemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        delay: index * 0.1
      }}
    >
      <Box
        component={Link}
        to={to}
        className={classes.navItem}
        data-active={isActiveRoute(to)}
      >
        <Group spacing="sm" noWrap>
          <Icon size={20} className={classes.navIcon + ' nav-icon'} />
          <Text className={classes.navLabel}>{label}</Text>
        </Group>
      </Box>
    </motion.div>
  );

  return (
    <Navbar p="md" className={classes.navbar} width={{ base: 250 }}>
      <Stack spacing="xs" className={classes.mobileNav}>
        <AnimatePresence mode="wait">
          {navigationItems.map((item, index) => (
            <NavItem 
              key={item.id} 
              {...item} 
              index={index}
            />
          ))}
          <Divider key="divider" className={classes.divider} />
          <NavItem 
            key={settingsItem.id} 
            {...settingsItem} 
            index={navigationItems.length}
          />
        </AnimatePresence>
      </Stack>
    </Navbar>
  );
};

export default Navigation; 