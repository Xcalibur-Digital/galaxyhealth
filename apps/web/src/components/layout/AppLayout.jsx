import { AppShell } from '@mantine/core';
import { Navigation } from '../Navigation';
import { Header } from './Header';

const AppLayout = ({ children }) => {
  return (
    <AppShell
      padding="md"
      navbar={<Navigation />}
      header={<Header />}
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          paddingTop: '60px'
        },
        navbar: {
          top: '60px',
          height: 'calc(100vh - 60px)'
        },
        header: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
          }`
        }
      })}
    >
      {children}
    </AppShell>
  );
};

export default AppLayout; 