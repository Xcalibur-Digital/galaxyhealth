import React from 'react';
import { Loader } from '@mantine/core';

export function LoadingSpinner({ size = 'md', centered = true }) {
  if (centered) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: '200px'
      }}>
        <Loader size={size} />
      </div>
    );
  }

  return <Loader size={size} />;
} 