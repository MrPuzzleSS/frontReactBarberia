import React from 'react';
import CIcon from '@coreui/icons-react';
import 'src/scss/css/global.css'; 

import {
  cilShieldAlt,
  cilCut,
  cilContact,
  cilCalendar,
  cilSpeedometer,
  cilIndustry,
  cilCart,
  cilPeople,
  cilMoney,
  cilBasket,
  cilCog,
  cilTags,
  cilGroup,
  cilCreditCard
} from '@coreui/icons';
import { CNavGroup, CNavItem } from '@coreui/react';
import { getUserInfo } from './components/auht';

const _nav = [
  {
    component: CNavItem,
    name: 'Inicio',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: <span style={{ fontWeight: 'bold' }}>Procesos de Compra</span>,
    to: '/compras',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Proveedores',
        to: '/proveedores',
        icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Compras',
        to: '/compras',
        icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'ProdInsumos',
        to: '/productos',
        icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: <span style={{ fontWeight: 'bold' }}>Procesos de Servicio</span>,
    to: '/servicios',
    icon: <CIcon icon={cilCut} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Empleados',
        to: '/empleados',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Servicios',
        to: '/servicios',
        icon: <CIcon icon={cilCut} customClassName="nav-icon" />,
      },
    ]
  },
      {
        component: CNavItem,
        name: <span style={{ fontWeight: 'bold' }}>Agendas</span>,
        to: '/agendas/crearconfiguracion',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      },
  {
    component: CNavGroup,
    name: <span style={{ fontWeight: 'bold' }}>Procesos de Venta</span>,
    to: '/ventas',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ventas',
        to: '/ventas',
        icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Clientes',
        to: '/clientes/listaClientes',
        icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
      },
    ]
  },
  {
    component: CNavGroup,
    name: <span style={{ fontWeight: 'bold' }}>Configuración</span>,
    to: '/configuracion',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/listausuarios',
        icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Roles',
        to: '/listarol',
        icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
      },
    ]
  }
];


const CheckPermission = ({ route }) => {
  const userInfo = getUserInfo();
  const permisos = userInfo.rol.permisos;
  const permisosRutas = permisos.map((permiso) => permiso.ruta);

  return permisosRutas.includes(route);
};

const FilteredNav = (navItems) => {
  return navItems.filter((item) => {
    if (item.to && item.component === CNavItem) {
      return CheckPermission({ route: item.to });
    } else if (item.items && item.component === CNavGroup) {
      item.items = FilteredNav(item.items);
      return item.items.length > 0;
    }
    return true;
  });
};

const filteredNavItems = FilteredNav(_nav);

export default filteredNavItems;

