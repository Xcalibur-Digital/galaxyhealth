import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { ErrorBoundary } from '../common/ErrorBoundary';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navigation />
      <main className="main-content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default MainLayout; 