import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeFirebase } from './services/firebase';
import App from './App.tsx';
import './index.css';

// Initialize Firebase BEFORE rendering the app
initializeFirebase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
