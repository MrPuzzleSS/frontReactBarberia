import React, { useState, useEffect } from "react";
import CitasDataService from "src/views/services/citasService";
import Servicios_S from "src/views/services/servicios_s";
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import 'src/scss/css/global.css';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem
} from "@coreui/react";
import PropTypes from 'prop-types'; // Importa PropTypes
import { getUserInfo } from '../../../../components/auht';

async function getEmpleadoConCitas(id_empleado) {
  try {
    const response = await CitasDataService.getEmpleadoConCitas(id_empleado);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el empleado y sus citas:', error);
    throw error;
  }
}

async function getNombreBarbero(id_empleado) {
  try {
    if (id_empleado) {
      // Si se proporciona el ID del empleado, obtén el nombre del barbero
      const response = await CitasDataService.getEmpleado(id_empleado);
      return response.data.nombre;
    } else {
      return "Nombre no disponible";
    }
  } catch (error) {
    console.error("Error obteniendo el nombre:", error);
    return "Nombre no disponible";
  }
}

function BarberoNombre({ id_empleado }) {
  const [nombre, setNombre] = useState(null);

  useEffect(() => {
    const fetchDataNombre = async () => {
      const nombre = await getNombreBarbero(id_empleado);
      setNombre(nombre);
    };

    fetchDataNombre();

  }, [id_empleado]);

  return <>{nombre}</>;
}

BarberoNombre.propTypes = {
  id_empleado: PropTypes.number
}

function ListaCitas() {
  const [visible, setVisible] = useState(false);
  const [citas, setCitas] = useState([]);
  const [detallesCita, setDetallesCita] = useState([]);
  const [tablaActualizada, setTablaActualizada] = useState(false);
  const [userId, setUserId] = useState(null);

  // Paginación
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la información del usuario logueado
        const userInfo = await getUserInfo();
        console.log("User ID:", userInfo.userId);
        setUserId(userInfo.userId);

        // Obtener todas las citas para el usuario logueado
        let response;
        if (userInfo.userType === 1) {
          // Si el usuario es Admin, obtén las citas de los usuarios 2 y 3
          const response1 = await CitasDataService.getAllCitasServicios(2);
          const response2 = await CitasDataService.getAllCitasServicios(3);
          const citasData = response1.data.concat(response2.data);
          response = { data: { citas: citasData } };
        } else if (userInfo.userType === 2) {
          // Si el usuario es Empleado, obtén sus citas específicas
          response = await CitasDataService.getEmpleadoConCitas(userInfo.userId);
        } else {
          // Si el usuario es Cliente, obtén solo sus citas
          response = await CitasDataService.getAllCitasServicios(userInfo.userId);
        }

        console.log("Citas response:", response);

        // Verificar si response.data.citas es un array antes de mapearlo
        if (Array.isArray(response.data?.citas)) {
          // Mapear las citas con sus detalles
          const citasConDetalle = await Promise.all(
            response.data.citas.map(async (item) => {
              console.log("Cita item:", item);

              const cita = {
                id_cita: item.id_cita,
                id_empleado: item.id_empleado,
                id_usuario: item.id_usuario,
                Fecha_Atencion: item.Fecha_Atencion,
                Hora_Atencion: item.Hora_Atencion,
                Hora_Fin: item.Hora_Fin,
                estado: item.estado,
                
              };

              // Obtener el nombre del barbero asociado a la cita
              const nombreBarbero = await getNombreBarbero(item.id_empleado);
              console.log("Nombre del barbero:", nombreBarbero);

              // Verificar si item.citaServicio está definido antes de mapearlo
              const detallesCita = Array.isArray(item.citaServicio) ? await Promise.all(
                item.citaServicio.map(async (detalle) => {
                  try {
                    const response = await Servicios_S.get(detalle.id_servicio);
                    console.log("Servicio detalle:", response.data);
                    return {
                      id_servicio: detalle.id_servicio,
                      servicioInfo: response.data,
                    };
                  } catch (error) {
                    console.error(
                      `Error obteniendo detalles del servicio con ID ${detalle.id_servicio}:`,
                      error,
                    );
                    return {
                      id_servicio: detalle.id_servicio,
                      servicioInfo: null,
                    };
                  }
                })
              ) : [];

              return {
                cita,
                detallesCita,
                nombreBarbero,
              };
            }),
          );

          // Actualizar las citas según el tipo de usuario
          if (userInfo.userType === 2) {
            // Si es Empleado, filtrar las citas por su ID
            const citasEmpleado = citasConDetalle.filter(cita => cita.cita.id_empleado === userInfo.userId);
            setCitas(citasEmpleado);
          } else {
            // Si es Admin o Cliente, mostrar todas las citas
            setCitas(citasConDetalle);
          }
        } else {
          console.error("Error: response.data.citas no es un array");
        }
      } catch (error) {
        console.error("Error al obtener citas:", error);
      }
    };

    fetchData();
  }, [tablaActualizada]);


  const cancelarCita = async (idCita) => {
    // Mostrar un cuadro de diálogo de confirmación
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Realmente quieres cancelar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar cita',
      cancelButtonText: 'No, mantener cita'
    });

    // Si el usuario confirma la cancelación
    if (confirmacion.isConfirmed) {
      try {
        // Llamar a la función para cambiar el estado de la cita
        await CitasDataService.cambiarEstadoCita(idCita);

        // Actualizar la tabla
        setTablaActualizada(prevState => !prevState);

        // Mostrar mensaje de éxito
        Swal.fire('Éxito', 'La cita se ha cancelado exitosamente', 'success');
      } catch (error) {
        // Si ocurre un error, mostrar un mensaje de error
        Swal.fire('Error', 'No se pudo cancelar la cita', 'error');
      }
    }
  }

  const mostrarDetalleCompra = (cita) => {
    setVisible(true);
    setDetallesCita(cita.detallesCita);
    console.log("Detalles de la cita:", cita.detallesCita);

  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Lista de citas</CCardHeader>
            <CCardBody>
              <CTable responsive align="middle" striped>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Barbero</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Fecha de Atencion</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Hora de Atencion</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Hora Fin </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {citas.map((cita, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell><BarberoNombre id_empleado={cita.cita.id_empleado} /></CTableDataCell>
                      <CTableDataCell>{format(new Date(cita.cita.Fecha_Atencion), "dd/MM/yyyy")}</CTableDataCell>
                      <CTableDataCell>{cita.cita.Hora_Atencion}</CTableDataCell>
                      <CTableDataCell>{cita.cita.id_usuario}</CTableDataCell>
                      <CTableDataCell>{cita.cita.Hora_Fin}</CTableDataCell>
                      <CTableDataCell>{cita.cita.estado}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="danger" onClick={() => cancelarCita(cita.cita.id_cita)}>Cancelar</CButton>
                        <CButton color="info" onClick={() => mostrarDetalleCompra(cita)}>Detalle</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
              >
                <CModalHeader onClose={() => setVisible(false)}>
                  <CModalTitle id="LiveDemoExampleLabel">
                    Detalle Cita
                  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>ID Servicio</CTableHeaderCell>
                        <CTableHeaderCell>Nombre Servicio</CTableHeaderCell>
                        <CTableHeaderCell>Valor</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {detallesCita.map((detalle, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{detalle.id_servicio}</CTableDataCell>
                          <CTableDataCell>{detalle.servicioInfo.nombre}</CTableDataCell>
                          <CTableDataCell>{detalle.servicioInfo.valor}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              <CPagination align="center" aria-label="Page navigation example" className="mt-3">
                <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Anterior
                </CPaginationItem>
                {Array.from({ length: Math.ceil(citas.length / pageSize) }, (_, i) => (
                  <CPaginationItem
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    active={i + 1 === currentPage}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(citas.length / pageSize)}
                >
                  Siguiente
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default ListaCitas;
