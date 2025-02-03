export const theme = {
  colorScheme: 'dark',
  primaryColor: 'indigo',
  defaultRadius: 'md',
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
  colors: {
    // Custom color palette
    brand: [
      '#EDF2FF', // 0
      '#DBE4FF', // 1
      '#BAC8FF', // 2
      '#91A7FF', // 3
      '#748FFC', // 4
      '#5C7CFA', // 5
      '#4C6EF5', // 6
      '#4263EB', // 7
      '#3B5BDB', // 8
      '#364FC7'  // 9
    ],
    success: [
      '#EBFBEE',
      '#D3F9D8',
      '#B2F2BB',
      '#8CE99A',
      '#69DB7C',
      '#51CF66',
      '#40C057',
      '#37B24D',
      '#2F9E44',
      '#2B8A3E'
    ],
    warning: [
      '#FFF9DB',
      '#FFF3BF',
      '#FFEC99',
      '#FFE066',
      '#FFD43B',
      '#FCC419',
      '#FAB005',
      '#F59F00',
      '#F08C00',
      '#E67700'
    ],
    danger: [
      '#FFF5F5',
      '#FFE3E3',
      '#FFC9C9',
      '#FFA8A8',
      '#FF8787',
      '#FF6B6B',
      '#FA5252',
      '#F03E3E',
      '#E03131',
      '#C92A2A'
    ]
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    sizes: {
      h1: { 
        fontSize: '2.5rem', 
        lineHeight: 1.2,
        fontWeight: 800,
        letterSpacing: '-0.02em'
      },
      h2: { 
        fontSize: '2rem', 
        lineHeight: 1.3,
        fontWeight: 700,
        letterSpacing: '-0.01em'
      },
      h3: { fontSize: '1.25rem', lineHeight: 1.4 },
      h4: { fontSize: '1.125rem', lineHeight: 1.4 },
      h5: { fontSize: '1rem', lineHeight: 1.5 },
      h6: { fontSize: '0.875rem', lineHeight: 1.5 },
    },
  },
  other: {
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: (theme) => ({
        root: {
          transition: 'all 150ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows.md,
          }
        }
      })
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
        p: 'xl'
      },
      styles: (theme) => ({
        root: {
          transition: 'all 150ms ease',
          '&:hover': {
            boxShadow: theme.shadows.md
          }
        }
      })
    }
  }
}; 