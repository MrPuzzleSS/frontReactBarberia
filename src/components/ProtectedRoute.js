import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importamos PropTypes para validar las props
export const getToken = () => {
    return localStorage.getItem('token') || '';
  }; 
const ProtectedRoute = ({ component: Component, location, ...rest }) => {
     const isAuthenticated = () => {
        try {
          const token = getToken();
          const expirationDate = localStorage.getItem('tokenExpiration');
      
          if (!token || !expirationDate) {
            return false;
          }
      
          const currentDateTime = new Date();
          const tokenExpirationDateTime = new Date(expirationDate);
      
          return currentDateTime < tokenExpirationDateTime;
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          return false;
        }
      }; // Reemplaza esto con tu lógica de autenticación real

  return (
    <Route
    {...rest}
    element={isAuthenticated() ? <Component /> : <Navigate to="/login" state={{ from: location }} />}
  />
  
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired, // Validamos que 'component' sea un elemento React
  location: PropTypes.object, // Validamos que 'location' sea un objeto
};

export default ProtectedRoute;
