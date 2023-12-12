import React from "react";

const paginaInicio = React.lazy(() => import('./views/home/'))
const reservarCita = React.lazy(() => import('./views/home/citas/crearCita'))
const listaCitas = React.lazy(() => import('./views/home/citas/listaCitas'))

const routes = [

    { path: '/', exact: true, name: 'Inicio' },
    { path: '/inicio', name:'Inicio Cliente', element: paginaInicio},
    { path: '/reservar', name:'Agendar cita', element: reservarCita},
    { path: '/listaCitas', name:'Lista de citas', element: listaCitas},
]

export default routes