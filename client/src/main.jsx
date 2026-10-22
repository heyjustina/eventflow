import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { EventProvider } from './context/EventContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <EventProvider>
          <App />
        </EventProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);