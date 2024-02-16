/*import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importa PropTypes
import { isAuthenticated } from '../components/auht'; // Importa tus funciones de autenticación

const PrivateRoute = ({ element, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated() ? element : <Navigate to="/login" replace />}
    />
  );
};

// Define los PropTypes para el componente
PrivateRoute.propTypes = {
  element: PropTypes.node.isRequired,
  // Otras props que puedas tener en el futuro
};

export default PrivateRoute;
*/