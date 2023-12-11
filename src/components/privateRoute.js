import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route } from 'react-router-dom';
import { isAuthenticated } from './auht';  // Asegúrate de que la importación sea correcta
import ListaUsuarios from '../views/users/listaUsuarios/Usuarios';  // Ajusta la importación según la ubicación real


const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuth = isAuthenticated();

  return isAuth ? (
    <Route {...rest} element={<ListaUsuarios />} />
  ) : (
    <Navigate to="/login" />
  );
};

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
