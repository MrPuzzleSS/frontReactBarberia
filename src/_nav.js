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
  },
  {
    component: CNavItem,
    name: 'Proveedores',
    to: '/proveedores',
    icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Compras',
    to: '/compras',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Empleados',
    to: '/empleados',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Agendas',
    to: '/agendas/crearconfiguracion',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Ventas',
    to: '/ventas',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista de Ventas',
        to: '/ventas',
      },
      {
        component: CNavItem,
        name: 'Cargar Ventas',
        to: '/ventas/cargarVentas',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Insumos',
    to: '/insumos',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />
  },


  {
    component: CNavItem,
    name: 'Clientes',
    to: '/clientes/listaClientes',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Servicios',
    to: '/servicios',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Productos',
    to: '/Productos',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />
  },
  
  {
    component: CNavGroup,
    name: 'Configuración',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavGroup,
        name: 'Usuarios',
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Lista de Usuarios',
            to: '/listaUsuarios',
            icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Roles',
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Lista de roles',
            to: '/ListaRol',  // Asegúrate de que la ruta sea la correcta
            icon: <CIcon icon={cilUser} customClassName="nav-icon" />,

          },
        ],
      },
    ]
  }

]

export default _nav
