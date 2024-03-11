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
    name: 'Proveedores', style : {color: 'black'},
    to: '/proveedores',
    icon: <CIcon icon={cilIndustry} customClassName="nav-icon" style={{color:'black'}}/>
  },
  {
    component: CNavItem,
    name: 'Compras', style : {color: 'black'},
    to: '/compras',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{color:'black'}}/>
  },
  {
    component: CNavItem,
    name: 'Empleados', style : {color: 'black'},
    to: '/empleados',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" style={{color:'black'}}/>,
  },

  {
    component: CNavItem,
    name: 'Agendas', style : {color: 'black'},
    to: '/agendas/crearconfiguracion',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{color:'black'}}/>,
  },
  {
    component: CNavItem, style : {color: 'black'},
    name: 'Ventas',
    to: '/ventas',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{color:'black'}}/>,
  },
  {
    component: CNavItem,
    name: 'Insumos', style : {color: 'black'},
    to: '/insumos',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" style={{color:'black'}}/>
  },


  {
    component: CNavItem,
    name: 'Clientes', style : {color: 'black'},
    to: '/clientes/listaClientes',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{color:'black'}}/>
  },
  {
    component: CNavItem,
    name: 'Servicios', style : {color: 'black'},
    to: '/servicios',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" style={{color:'black'}}/>
  },
  {
    component: CNavItem,
    name: 'Productos', style : {color: 'black'},
    to: '/Productos',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" style={{color:'black'}}/>
  },
  
  {
    component: CNavGroup,
    name: 'Configuración', style : {color: 'black'},
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" style={{color:'black'}}/>,
    items: [
      {
        component: CNavGroup,
        name: 'Usuarios', style : {color: 'black'},
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" style={{color:'black'}}/>,
        items: [
          {
            component: CNavItem,
            name: 'Lista de Usuarios', style : {color: 'black'},
            to: '/listaUsuarios',
            icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{color:'black'}}/>,
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Roles', style : {color: 'black'},
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" style={{color:'black'}}/>,
        items: [
          {
            component: CNavItem,
            name: 'Lista de roles', style : {color: 'black'},
            to: '/ListaRol',  // Asegúrate de que la ruta sea la correcta
            icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{color:'black'}}/>,

          },
        ],
      },
    ]
  }

]

export default _nav
