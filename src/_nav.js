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

  // {
  //   component: CNavItem,
  //   name: 'Insumos',
  //   to: '/insumos',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />
  // },


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
    name: 'ProdInsumos',
    to: '/Productos',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" style={{color:'black'}}/>
  },
          {
            component: CNavItem,
            name: 'Usuarios',
            to: '/listaUsuarios',
            icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
          
      },
      
          {
            component: CNavItem,
            name: 'Roles',
            to: '/ListaRol',  // Asegúrate de que la ruta sea la correcta
            icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{color:'black'}}/>,

          },
        
        ]
export default _nav
