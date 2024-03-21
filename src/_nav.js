import React from 'react';
import CIcon from '@coreui/icons-react';
import 'src/scss/css/global.css'; // Importa el archivo CSS global

import {
  cilShieldAlt,
  cilCut,
  cilContact,
  cilCalendar,
  cilSpeedometer,
  cilUser,
  cilIndustry,
  cilCart,
  cilPeople,
  cilMoney,
  cilBasket,
} from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';
import { getUserInfo } from './components/auht';

const _nav = [
  {
    component: CNavItem,
    name: 'Inicio',
    style: { color: 'black' },
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Procesos de Compra',
    style: { color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Proveedores',
    style: { color: 'black' },
    to: '/proveedores',
    icon: <CIcon icon={cilIndustry} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Compras',
    style: { color: 'black' },
    to: '/compras',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'ProdInsumos',
    style: { color: 'black' },
    to: '/productos',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Procesos de Servicio',
    style: { color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Empleados',
    style: { color: 'black' },
    to: '/empleados',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Servicios',
    style: { color: 'black' },
    to: '/servicios',
    icon: <CIcon icon={cilCut} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Proceso de Agenda',
    style: { color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Agendas',
    style: { color: 'black' },
    to: '/agendas/crearconfiguracion',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Procesos de Venta',
    style: { color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Ventas',
    style: { color: 'black' },
    to: '/ventas',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Clientes',
    style: { color: 'black' },
    to: '/clientes/listaClientes',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Procesos de Configuración',
    style: { color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    style: { color: 'black' },
    to: '/listausuarios',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Roles',
    style: { color: 'black' },
    to: '/listarol',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
];

const CheckPermission = ({ route }) => {
  const userInfo = getUserInfo();
  const permisos = userInfo.rol.permisos;
  const permisosRutas = permisos.map((permiso) => permiso.ruta);

  if (permisosRutas.includes(route)) {
    return true;
  }
  return false;
};

const FilteredNav = _nav.filter((item) => {
  if (item.to && item.component === CNavItem) {
    return CheckPermission({ route: item.to });
  }
  return true;
});

export default FilteredNav;
