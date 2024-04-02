import React from 'react';
import App from './App';
import { Provider } from 'react-redux'; // Asegúrate de tener la importación correcta
import { createRoot } from 'react-dom/client';
import { UserProvider } from './components/userContext';
import store from './store';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <UserProvider>
      <App />
    </UserProvider>
  </Provider>,
);
