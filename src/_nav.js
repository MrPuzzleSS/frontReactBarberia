import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilPuzzle,
  cilShieldAlt,
  cilScissors,
  cilCut,
  cilContact,
  cilCalendar,
  cilSpeedometer,
  cilUser,
  cilSettings,
  cilFace,
  cilIndustry,
  cilCart,
  cilHeart,
  cilPeople,
  cilMoney,
  cilBasket,
} from '@coreui/icons';
import { CNavGroup, CNavItem } from '@coreui/react';

const _nav = [
  {
    component: CNavItem,
    name: 'Inicio',
    style: { color: 'black' },
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" style={{ color: 'black' }} />,
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
    name: 'Empleados',
    style: { color: 'black' },
    to: '/empleados',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Agendas',
    style: { color: 'black' },
    to: '/agendas/crearconfiguracion',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" style={{ color: 'black' }} />,
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
    component: CNavItem,
    name: 'Servicios',
    style: { color: 'black' },
    to: '/servicios',
    icon: <CIcon icon={cilCut} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'ProdInsumos',
    style: { color: 'black' },
    to: '/Productos',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    style: { color: 'black' },
    to: '/listaUsuarios',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
  {
    component: CNavItem,
    name: 'Roles',
    style: { color: 'black' },
    to: '/ListaRol',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" style={{ color: 'black' }} />,
  },
];

export default _nav;
