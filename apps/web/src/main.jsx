import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Starting app initialization...');

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 