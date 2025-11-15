import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from '@/components/ui/ErrorBoundary/ErrorBoundary';
import './index.css';

// Global portal color system
const portalWorlds = [
  { colors: ['#ff00cc', '#00fff7', '#1a003a'], label: 'Fractal' },
  { colors: ['#ffea00', '#7300ffff', '#003a2a'], label: 'Nebula' },
  { colors: ['#ff3300', '#cc00ff', '#0a0f1a'], label: 'Inferno' },
  { colors: ['#00ff33', '#00aaff', '#003a3a'], label: 'Emerald' },
  { colors: ['#ffffff', '#00fff7', '#0a0f1a'], label: 'Singularity' },
];

function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}

function updateGlobalPortalColors() {
  const newPortal = quantumCollapse(portalWorlds);
  document.documentElement.style.setProperty('--portal-color-0', newPortal.colors[0]);
  document.documentElement.style.setProperty('--portal-color-1', newPortal.colors[1]);
  document.documentElement.style.setProperty('--portal-color-2', newPortal.colors[2]);
}

// Initialize with random colors
updateGlobalPortalColors();

// Change colors on click globally
document.addEventListener('click', updateGlobalPortalColors);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
