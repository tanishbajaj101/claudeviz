import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { clearExpiredChats } from './lib/chat-storage';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// Cleanup expired chats on app initialization
clearExpiredChats();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
