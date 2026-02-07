/**
 * App Component
 * Main application entry point with routing
 */

import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import './styles/global.css';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#2F2F2F',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#6B9B7A',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#C97A7A',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </>
  );
}

export default App;
