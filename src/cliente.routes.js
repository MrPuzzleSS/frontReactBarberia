import React from "react";

const paginaInicio = React.lazy(() => import('./views/home/'))
const reservarCita = React.lazy(() => import('./views/home/citas/crearCita'))

const routes = [

    { path: '/', exact: true, name: 'Inicio' },
    { path: '/inicio', name:'Inicio Cliente', element: paginaInicio},
    { path: '/reservar', name:'Agendar cita', element: reservarCita}
]

export default routes