import { Group, Box, useMantineColorScheme, Text } from '@mantine/core';

export const Header = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      component="header"
      className="animated-header"
      h={60}
    >
      <Group 
        position="apart" 
        h="100%" 
        w="100%" 
        sx={{ 
          padding: 0,
          '& > img': { marginLeft: 0 } // Remove any default margin
        }}
      >
        <Box pl={0}>
          <img 
            src={isDark ? "/logo-horizontal-white.svg" : "/logo-horizontal-black.svg"}
            alt="Arcadia Logo"
            className="arcadia-logo"
          />
        </Box>
        <Text 
          size="xl" 
          weight={700} 
          color="white"
          pr="md"
          sx={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
        >
          Galaxy Health
        </Text>
      </Group>
    </Box>
  );
};

export default Header; 