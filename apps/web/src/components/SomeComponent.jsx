import { Box } from '@mantine/core';

const containerStyles = (theme) => ({
  container: {
    padding: theme.spacing.md,
    '@media (max-width: theme.breakpoints.sm)': {
      padding: theme.spacing.sm
    }
  },
  searchBar: {
    display: 'flex',
    gap: rem(16),
    alignItems: 'center',
    '@media (max-width: theme.breakpoints.sm)': {
      flexDirection: 'column'
    }
  }
});

const { classes } = useStyles();

return (
  <Box 
    className={classes.container}
  >
    {/* component content */}
  </Box>
); 