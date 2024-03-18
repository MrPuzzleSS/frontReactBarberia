import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilPuzzle,
  cilSpeedometer,
  cilUser,
  cilSettings,
  cilIndustry,
  cilCart,
  cilPeople,
  cilMoney,
  cilBasket,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Inicio',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permissions: ['dashboard.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Proveedores',
    to: '/proveedores',
    icon: <CIcon icon={cilIndustry} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['proveedores.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Compras',
    to: '/compras',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['compras.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Empleados',
    to: '/empleados',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['empleados.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Agendas',
    to: '/agendas/crearconfiguracion',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['agendas.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Ventas',
    to: '/ventas',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['ventas.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Clientes',
    to: '/clientes/listaClientes',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['clientes.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Servicios',
    to: '/servicios',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['servicios.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'ProdInsumos',
    to: '/Productos',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['productos.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/listaUsuarios',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permissions: ['usuarios.view'], // Permiso requerido para ver esta ruta
  },
  {
    component: CNavItem,
    name: 'Roles',
    to: '/ListaRol',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{color:'black'}}/>,
    permissions: ['roles.view'], // Permiso requerido para ver esta ruta
  },
];

export default _nav;
