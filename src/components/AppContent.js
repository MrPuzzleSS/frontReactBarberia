import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CContainer, CSpinner } from '@coreui/react';
import PropTypes from 'prop-types';
import { routes} from '../routes';
import { isAuthenticated } from '../components/auht';

const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        {/* Cambiado a Routes en lugar de Route */}
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    (route.path) && !isAuthenticated() ? (
                      <Navigate to="/login" replace />
                    ) : (
                      <route.element />
                    )
                  }
                />
              )
            );
          })}
        </Routes>
      </Suspense>
    </CContainer>
  );
};

// Agregamos propTypes para evitar errores de linting
AppContent.propTypes = {
  path: PropTypes.string,
  element: PropTypes.node,
};

export default React.memo(AppContent);
