import React from 'react'



const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))


// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))

const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))




const ListaProveedores = React.lazy(()  => import('./views/proveedores/listaProveedores'))
const CrearProveedor = React.lazy(() => import('./views/proveedores/crearProveedor'))
const ListaCompras = React.lazy(() => import('./views/compras/listaCompras'))
const CrearCompra = React.lazy(() => import('./views/compras/crearCompraProd'))
const CrearCompraInsumo = React.lazy(() => import('./views/compras/crearCompraInsu'))

const ListaEmpleados = React.lazy(() => import('./views/empleados/listaEmpleados'))
const CrearEmpleados = React.lazy(() => import('./views/empleados/crearEmpleado'))

const ListarVentas = React.lazy(() => import('./views/ventas/listaVentas'))
const FormularioVentas = React.lazy(() => import('./views/ventas/CrearVentas'))
const CargarVentas = React.lazy(() => import('./views/ventas/cargarVentas'))

const Usuarios = React.lazy(() => import('./views/users/listaUsuarios/Usuarios'))
const CrearUsuarios = React.lazy(() => import('./views/users/crearUsuario/CrearUser'))
const EditarUsuarios = React.lazy(() => import('./views/pages/login/editProfile'))
const UserInformationPage = React.lazy(() => import('./views/pages/login/UserInfo'));


const Roles = React.lazy(() => import('./views/rol/listaRoles/Roles'))
const CrearRol = React.lazy(() => import('./views/rol/CrearRol/CreateRol'))




const ListaProductos = React.lazy(() => import('./views/productos/listaProductos'))
const CrearProducto = React.lazy(() => import('./views/productos/crearProducto'))

const ListaServicios = React.lazy(() => import('./views/servicios/listaServicios'))
const CrearServicio = React.lazy(() => import('./views/servicios/crearServicio'))

const ListaClientes = React.lazy(() => import('./views/clientes/listaClientes'))
const CrearCliente = React.lazy(() => import('./views/clientes/crearCliente'))

// const ListaInsumos = React.lazy(() => import('./views/insumos/listaInsumos'))
// const CrearInsumo = React.lazy(() => import('./views/insumos/crearInsumo'))

const CrearConfiguracion = React.lazy(() => import('./views/agendas/crearConfiguracion/programacion'))


const routes = [
  //TODAS LAS RUTAS DEL PROYECTO

  { path: '/', exact: true, name: 'Home', element:Dashboard},

  { path: '/dashboard', name: 'Dashboard', element:Dashboard },
  //{ path: '/dashboard', name: 'Dashboard', element: <PrivateRoute path="/dashboard" element={<Dashboard />} /> },
  
  // ... (otras rutas públicas y protegidas)


  { path: '/proveedores', name: 'Proveedores', element: ListaProveedores },
  { path: '/proveedores/lista-proveedores', name: 'Proveedores', element: ListaProveedores },
  { path: '/proveedores/crear-proveedor', name: 'Nuevo proveedor', element: CrearProveedor },
  { path: '/compras', name: 'Compras', element: ListaCompras },
  { path: '/compras/lista-compras', name: 'Lista Compras', element: ListaCompras },
  { path: '/compras/crear-compra', name: 'Crear Compra', element: CrearCompra },
  { path: '/compras/crear-comprainsu', name: 'Nueva compra insumo', element: CrearCompraInsumo},
  
  { path: '/empleados', name: 'Empleados', element: ListaEmpleados},
  { path: '/empleados/listaEmpleados', name: 'Listado', element: ListaEmpleados},
  { path: '/empleados/crearEmpleados', name: 'Crear', element: CrearEmpleados},

  { path: '/ventas', name: 'Ventas', element: ListarVentas },
  { path: '/ventas/listaVentas', name: 'Listado', element: ListarVentas},
  { path: '/ventas/CrearVentas', name: 'Crear', element: FormularioVentas},
  { path: '/ventas/cargarVentas', name: 'cargar', element: CargarVentas },

  { path: '/clientes/listaClientes', name: 'Listado', element: ListaClientes },
  { path: '/clientes/crearClientes', name: 'Crear', element: CrearCliente },
  { path: '/agendas/crearConfiguracion', name: 'Crear', element: CrearConfiguracion },
  { path: '/servicios', name: 'Servicios', element: ListaServicios },
  { path: '/servicios/listaServicios', name: 'Listado de Servicios', element: ListaServicios },
  { path: '/servicios/crearServicio', name: 'Crear Servicio', element: CrearServicio },
  

  // { path: '/insumos', name: 'Insumos', element: ListaInsumos },
  // { path: '/insumos/listaIsumos', name: 'Listado de Insumos', element: ListaInsumos },
 // { path: '/insumos/crearInsumo', name: 'Crear Insumo', element: CrearInsumo },

  { path: '/ventas/listaVentas', name: 'Ventas', element: ListarVentas},

  { path: '/ListaUsuarios', name: 'Usuarios',element : Usuarios},
  { path: '/CrearUsuarios', name: 'CrearUsuarios', element: CrearUsuarios},
  { path: '/EditProfile', name: 'EditarUsuario', element: EditarUsuarios},
  { path: '/UserInfo', name: 'InfoUsuario', element: UserInformationPage},

  { path: '/ListaRol', name: 'Roles', element: Roles},
  { path: '/CrearRol', name: 'CrearRol', element: CrearRol},
  

  
  { path: '/productos', name: 'productos', element: ListaProductos },
  { path: '/productos/lista-productos', name: 'Productos', element: ListaProductos },
  { path: '/productos/crear-producto', name: 'Nuevo producto', element: CrearProducto },
  { path: '/clientes/listaClientes', name: 'Listado', element: ListaClientes },
  { path: '/clientes/crearClientes', name: 'Crear', element: CrearCliente },
  { path: '/agendas/crearConfiguracion', name: 'Crear', element: CrearConfiguracion },
  { path: '/servicios', name: 'Servicios', element: ListaServicios },
  { path: '/servicios/listaServicios', name: 'Listado de Servicios', element: ListaServicios },
  { path: '/servicios/crearServicio', name: 'Crear Servicio', element: CrearServicio },
  // { path: '/insumos', name: 'Insumos', element: ListaInsumos },
  // { path: '/insumos/listaIsumos', name: 'Listado de Insumos', element: ListaInsumos },
  // { path: '/insumos/crearInsumo', name: 'Crear Insumo', element: CrearInsumo },
  //------------------------------------------------------------------------------------


  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // { path: '/widgets', name: 'Widgets', element: Widgets },
]

export { routes};