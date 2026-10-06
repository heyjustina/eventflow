import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { EventProvider } from './context/EventContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <EventProvider>
        <App />
      </EventProvider>
    </HashRouter>
  </StrictMode>
);