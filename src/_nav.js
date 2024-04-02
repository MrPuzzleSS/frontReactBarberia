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
import { CNavGroup, CNavItem } from '@coreui/react';
import { getUserInfo } from './components/auht';

const _nav = [
  {
    component: CNavItem,
    name: 'Inicio',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
  },
  {
    component: CNavGroup,
    name: 'Procesos de Compra',
    to: '/compras',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
    items: [
      {
        component: CNavItem,
        name: 'Proveedores',
        to: '/proveedores',
        icon: <CIcon icon={cilIndustry} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
      {
        component: CNavItem,
        name: 'Compras',
        to: '/compras',
        icon: <CIcon icon={cilCart} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
      {
        component: CNavItem,
        name: 'ProdInsumos',
        to: '/productos',
        icon: <CIcon icon={cilBasket} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Procesos de Servicio',
    to: '/servicios',
    icon: <CIcon icon={cilCut} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
    items: [
      {
        component: CNavItem,
        name: 'Empleados',
        to: '/empleados',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
      {
        component: CNavItem,
        name: 'Servicios',
        to: '/servicios',
        icon: <CIcon icon={cilCut} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Agenda',
    to: '/agenda',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
    items: [
      {
        component: CNavItem,
        name: 'Agendas',
        to: '/agendas/crearconfiguracion',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Procesos de Venta',
    to: '/ventas',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
    items: [
      {
        component: CNavItem,
        name: 'Ventas',
        to: '/ventas',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
      {
        component: CNavItem,
        name: 'Clientes',
        to: '/clientes/listaClientes',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Configuración',
    to: '/configuracion',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
    items: [
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/listausuarios',
        icon: <CIcon icon={cilContact} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
      {
        component: CNavItem,
        name: 'Roles',
        to: '/listarol',
        icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" style={{ fontWeight: 'bold',color: 'black' }} />,
      },
    ]
  }
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
