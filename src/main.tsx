import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { DocumentProvider } from './contexts/DocumentContext.tsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DocumentProvider>
          <Toaster position="top-right" />
          <App />
        </DocumentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);