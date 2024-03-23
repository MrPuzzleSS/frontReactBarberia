import React from 'react';
import CIcon from '@coreui/icons-react';
import 'src/scss/css/global.css'; 

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
    style: { fontWeight: 'bold',color: 'black' },
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Procesos de Compra',
    style: { fontWeight: 'bold',color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Proveedores',
    style: { color: 'black' },
    to: '/proveedores',
    icon: <CIcon icon={cilIndustry} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  
 
  {
    component: CNavItem,
    name: 'Compras',
    style: { fontWeight: 'bold',color: 'black' },
    to: '/compras',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'ProdInsumos',
    style: { fontWeight: 'bold',color: 'black' },
    to: '/productos',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Procesos de Servicio',
    style: { fontWeight: 'bold',color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Empleados',
    style: { fontWeight: 'bold',color: 'black' },
    to: '/empleados',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Servicios',
    style:{ fontWeight: 'bold',color: 'black' },
    to: '/servicios',
    icon: <CIcon icon={cilCut} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Proceso de Agenda',
    style: { fontWeight: 'bold',color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Agendas',
    style: { fontWeight: 'bold',color: 'black' },
    to: '/agendas/crearconfiguracion',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Procesos de Venta',
    style: { fontWeight: 'bold',color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Ventas',
    style: { fontWeight: 'bold',color: 'black' },
    to: '/ventas',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Clientes',
    style: { fontWeight: 'bold',color: 'black' },
    to: '/clientes/listaClientes',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavTitle,
    name: 'Configuración',
    style: { fontWeight: 'bold',color: 'black' },
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    style: { fontWeight: 'bold',color: 'black' },
    to: '/listausuarios',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Roles',
    style: { fontWeight: 'bold',color: 'black' },
    to: '/listarol',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
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
