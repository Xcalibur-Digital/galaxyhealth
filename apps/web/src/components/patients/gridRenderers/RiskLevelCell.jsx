import React from 'react';
import { Badge, createTheme, rem } from '@mantine/core';

const useStyles = createTheme((theme) => ({
  badge: {
    textTransform: 'capitalize',
    fontWeight: 500,
    padding: `${rem(4)} ${rem(8)}`
  }
}));

const RiskLevelCell = ({ value }) => {
  const getRiskConfig = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return { color: 'red', label: 'High Risk' };
      case 'medium':
        return { color: 'yellow', label: 'Medium Risk' };
      case 'low':
        return { color: 'green', label: 'Low Risk' };
      default:
        return { color: 'gray', label: 'Not Set' };
    }
  };

  const config = getRiskConfig(value);

  return (
    <Badge 
      color={config.color}
      variant="light"
      size="sm"
      sx={useStyles.badge}
    >
      {config.label}
    </Badge>
  );
};

export default RiskLevelCell; 