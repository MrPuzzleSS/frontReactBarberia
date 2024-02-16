import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './scss/style.scss';
import ForgotPassword from './views/pages/login/resetPassword';
import ResetPassword from './views/pages/login/newPassword';
import EditProfilePage from './views/pages/login/editProfile';
import { isAuthenticated } from './components/auht'; // Asegúrate de que la ruta de importación sea correcta

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const ClienteLayaout = React.lazy(() => import('./layout/ClienteLayaout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const UserInformationPage = React.lazy(() => import('./views/pages/login/UserInfo'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword" element={<ForgotPassword />} />
          <Route path="/newPassword" element={<ResetPassword />} />
          <Route path="/EditProfile" element={isAuthenticated() ? <EditProfilePage />: <Navigate to="/login" />} />
          <Route path="/UserInfo" element={isAuthenticated() ? <UserInformationPage /> : <Navigate to="/login" />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
         <Route path="*"element={isAuthenticated() ? <DefaultLayout />:  <Navigate to="/login" />} />
  
          <Route path="cliente/*" element={<ClienteLayaout />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
