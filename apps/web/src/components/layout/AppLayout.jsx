import { AppShell } from '@mantine/core';

const AppLayout = () => {
  return (
    <AppShell
      padding="md"
      navbar={<Navigation />}
      header={<Header />}
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      {/* Your routes */}
    </AppShell>
  );
}; 