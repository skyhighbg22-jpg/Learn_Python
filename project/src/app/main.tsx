import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadRuntimeConfig } from './utils/runtimeConfig';

document.title = 'PyLearn - Master Python';

// Load runtime config (from /config.json or env vars) before rendering
(async () => {
  try {
    await loadRuntimeConfig();
    console.log('✓ App initialization: runtime config loaded');
  } catch (error) {
    console.error('Failed to load runtime config:', error);
    // Continue anyway—app will use fallback env vars
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
})();
