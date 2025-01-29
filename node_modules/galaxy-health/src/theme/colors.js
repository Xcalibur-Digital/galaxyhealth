// Using Mantine's color system
export const colors = {
  // Primary colors
  primary: {
    main: '#6200ee',
    light: '#9c27b0',
    dark: '#4a0072',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#03dac6',
    light: '#66fff9',
    dark: '#00a896',
    contrastText: '#000000'
  },
  error: {
    main: '#b00020',
    light: '#e94948',
    dark: '#790000',
    contrastText: '#ffffff'
  },
  background: {
    default: '#ffffff',
    paper: '#f5f5f5',
    dark: '#121212'
  },
  text: {
    primary: '#000000',
    secondary: '#666666',
    disabled: '#999999',
    hint: '#999999'
  },
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)'
  },

  // Gray scale
  gray: {
    0: '#f8fafc',
    1: '#f1f5f9',
    2: '#e2e8f0',
    3: '#cbd5e1',
    4: '#94a3b8',
    5: '#64748b',
    6: '#475569',
    7: '#334155',
    8: '#1e293b',
    9: '#0f172a',
  },

  // System colors
  success: {
    5: '#22c55e',
    6: '#16a34a',
  },
  warning: {
    5: '#f59e0b',
    6: '#d97706',
  },
  info: {
    5: '#3b82f6',
    6: '#2563eb',
  },

  // Theme colors
  dark: {
    background: '#1a1b1e',
    surface: '#25262b',
    border: '#2c2e33',
    text: '#c1c2c5',
    dimmed: '#909296',
  },
};

export const theme = {
  primaryColor: 'primary',
  colors: {
    primary: colors.primary,
    gray: colors.gray,
    dark: colors.dark,
  },
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px',
    md: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
    lg: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px',
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
  },
  spacing: {
    xs: '0.625rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },
};

export const buttonStyles = {
  filled: {
    background: colors.primary[5],
    color: 'white',
    hover: {
      background: colors.primary[6],
    },
    active: {
      background: colors.primary[7],
    },
    disabled: {
      background: colors.gray[4],
    },
  },
  gradient: {
    from: colors.primary[5],
    to: colors.primary[7],
    hover: {
      from: colors.primary[6],
      to: colors.primary[8],
    },
    disabled: {
      from: colors.gray[4],
      to: colors.gray[5],
    },
  },
};

export const darkTheme = {
  ...theme,
  colorScheme: 'dark',
  colors: {
    ...theme.colors,
    background: colors.dark.background,
    surface: colors.dark.surface,
    border: colors.dark.border,
    text: colors.dark.text,
    dimmed: colors.dark.dimmed,
  },
};

export const gradients = {
  primary: `linear-gradient(180deg, ${colors.primary[1]}, ${colors.primary[5]})`,
  secondary: `linear-gradient(180deg, ${colors.primary[2]}, ${colors.primary[6]})`,
  dark: `linear-gradient(180deg, ${colors.gray[8]}, ${colors.gray[9]})`,
  card: `linear-gradient(180deg, ${colors.dark.surface}, ${colors.dark.background})`,
  button: {
    default: `linear-gradient(135deg, ${buttonColors.default.from} 0%, ${buttonColors.default.to} 100%)`,
    hover: `linear-gradient(135deg, ${buttonColors.hover.from} 0%, ${buttonColors.hover.to} 100%)`,
    disabled: `linear-gradient(135deg, ${buttonColors.disabled.from} 0%, ${buttonColors.disabled.to} 100%)`,
  }
};

export const shadows = {
  small: '0 .125rem .25rem rgba(0, 0, 0, 0.3)',
  medium: '0 .5rem 1rem rgba(0, 0, 0, 0.4)',
  large: '0 1rem 3rem rgba(0, 0, 0, 0.5)',
};

export const fonts = {
  sansSerif: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif',
  monospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// Common CSS variables
export const cssVariables = `
  :root {
    --bs-primary: ${colors.primary[5]};
    --bs-secondary: ${colors.primary[2]};
    --bs-success: ${colors.success[5]};
    --bs-info: ${colors.info[5]};
    --bs-warning: ${colors.warning[5]};
    --bs-danger: ${colors.error[5]};
    --bs-light: ${colors.gray[0]};
    --bs-dark: ${colors.dark.background};
    
    --bs-body-font-family: ${fonts.sansSerif};
    --bs-body-font-size: 1rem;
    --bs-body-font-weight: 400;
    --bs-body-line-height: 1.5;
    --bs-body-color: ${colors.text.primary};
    --bs-body-bg: ${colors.background.primary};
    
    --bs-border-color: ${colors.border};
    --bs-border-color-translucent: rgba(255, 255, 255, 0.175);
  }
`;

// Add specific button colors
export const buttonColors = {
  default: {
    from: '#6610f2',    // Bootstrap indigo
    to: '#6610f2',      // Same color for solid look
  },
  hover: {
    from: '#6610f2',    // Bootstrap indigo
    to: '#d63384',      // Bootstrap pink
  },
  disabled: {
    from: '#6c757d',
    to: '#6c757d',
  },
  shadow: {
    default: 'rgba(102, 16, 242, 0.2)',
    hover: 'rgba(102, 16, 242, 0.3)',
  }
}; 