// userContext.js
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Lógica de autenticación y obtención de datos de usuario
    setUser(userData);
  };

  const logout = () => {
    // Lógica de cierre de sesión
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser utilizado dentro de un UserProvider');
  }
  return context;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};