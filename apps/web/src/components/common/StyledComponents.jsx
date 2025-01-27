import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.dark[7],
    borderRadius: theme.radius.lg,
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },

  statCard: {
    backgroundColor: theme.colors.dark[6],
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },

  actionButton: {
    borderRadius: theme.radius.md,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
    },
  },

  gradientText: {
    background: `linear-gradient(45deg, ${theme.colors.blue[4]}, ${theme.colors.blue[7]})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  section: {
    padding: `${theme.spacing.xl * 2}px 0`,
  },

  sectionTitle: {
    fontSize: theme.fontSizes.xl * 1.5,
    fontWeight: 700,
    marginBottom: theme.spacing.lg,
  },

  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.md,
  },
})); 