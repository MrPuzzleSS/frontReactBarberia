import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider as ReduxProvider } from 'react-redux';
import { UserProvider } from './components/userContext';
import { ProfileImageProvider } from 'src/views/ProfileImageContext';
import store from './store';

createRoot(document.getElementById('root')).render(
  <ReduxProvider store={store}>
    <UserProvider>
      <ProfileImageProvider>
        <App />
      </ProfileImageProvider>
    </UserProvider>
  </ReduxProvider>
);
