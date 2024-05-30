import React, { useState, useEffect } from "react";
import CitasDataService from "src/views/services/citasService";
import Servicios_S from "src/views/services/servicios_s";
import Swal from 'sweetalert2';
import { FaTimes, FaCheck } from 'react-icons/fa';
import 'src/scss/css/global.css';
import moment from 'moment';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CBadge,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CPagination,
  CPaginationItem
} from "@coreui/react";
import PropTypes from 'prop-types';
import { getUserInfo } from '../../../../components/auht';

async function getUsuarioNombre(id_usuario) {
  try {
    if (id_usuario) {
      const response = await CitasDataService.getUsuario(id_usuario);
      return response.data;
    } else {
      return { nombre: "Nombre no disponible" };
    }
  } catch (error) {
    console.error("Error obteniendo el nombre del usuario:", error);
    return { nombre: "Nombre no disponible" };
  }
}

function UsuarioNombre({ idUser }) {
  const [nombre, setNombre] = useState(null);

  useEffect(() => {
    const fetchDataNombre = async () => {
      const data = await getUsuarioNombre(idUser);
      setNombre(data.nombre);
    };

    fetchDataNombre();
  }, [idUser]);

  return <>{nombre}</>;
}

UsuarioNombre.propTypes = {
  idUser: PropTypes.number
}

async function getNombreBarbero(id_empleado) {
  try {
    if (id_empleado) {
      const response = await CitasDataService.getEmpleado(id_empleado);
      return response.data;
    } else {
      return { nombre: "Nombre no disponible", telefono: "Teléfono no disponible" };
    }
  } catch (error) {
    console.error("Error obteniendo el nombre:", error);
    return { nombre: "Nombre no disponible", telefono: "Teléfono no disponible" };
  }
}

function BarberoNombre({ id_empleado }) {
  const [nombre, setNombre] = useState(null);

  useEffect(() => {
    const fetchDataNombre = async () => {
      const data = await getNombreBarbero(id_empleado);
      setNombre(data.nombre);
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
  const [userRoleId, setUserRoleId] = useState(null);

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log('User Info:', userInfo);
        console.log('User ID:', userInfo.userId);
        console.log('User Role ID:', userInfo.rol.id_rol);

        setUserId(userInfo.userId);
        setUserRoleId(userInfo.rol.id_rol);

        let response;
        if (userInfo.rol.id_rol === 1) { // SuperAdmin
          console.log("Fetching citas for SuperAdmin");
          const response1 = await CitasDataService.getAllCitasServicios(2);
          console.log("Response1 for SuperAdmin:", response1);
          const response2 = await CitasDataService.getAllCitasServicios(3);
          console.log("Response2 for SuperAdmin:", response2);

          if (Array.isArray(response1.data.citas) && Array.isArray(response2.data.citas)) {
            // Eliminar duplicados basados en el id_cita
            const combinedCitas = [...response1.data.citas, ...response2.data.citas];
            const uniqueCitas = combinedCitas.filter((cita, index, self) =>
              index === self.findIndex((t) => t.id_cita === cita.id_cita)
            );
            response = { data: { citas: uniqueCitas } };
            console.log("Unique citasData for SuperAdmin:", uniqueCitas);
          } else {
            console.error("Error: response1.data.citas or response2.data.citas is not an array");
          }
        } else if (userInfo.rol.id_rol === 2) { // Empleado
          console.log("Fetching citas for Empleado");
          response = await CitasDataService.getAllCitasServicios(userInfo.userId);
          console.log("Response for Empleado:", response);
        } else if (userInfo.rol.id_rol === 3) { // Cliente
          console.log("Fetching citas for Cliente");
          response = await CitasDataService.getAllCitasServicios(userInfo.userId);
          console.log("Response for Cliente:", response);
        }

        console.log("Response:", response);
        if (response && Array.isArray(response.data?.citas)) {
          const citasConDetalle = await Promise.all(
            response.data.citas.map(async (item) => {
              const cita = {
                id_cita: item.id_cita,
                id_empleado: item.id_empleado,
                id_usuario: item.id_usuario,
                Fecha_Atencion: item.Fecha_Atencion,
                Hora_Atencion: item.Hora_Atencion,
                Hora_Fin: item.Hora_Fin,
                estado: item.estado,
              };

              const fechaAtencion = moment.utc(item.Fecha_Atencion).format('YYYY-MM-DD');

              const barberoData = await getNombreBarbero(item.id_empleado);
              const nombreBarbero = barberoData.nombre;
              const telefonoBarbero = barberoData.telefono;

              const detallesCita = Array.isArray(item.citaServicio) ? await Promise.all(
                item.citaServicio.map(async (detalle) => {
                  try {
                    const response = await Servicios_S.get(detalle.id_servicio);
                    return {
                      id_servicio: detalle.id_servicio,
                      servicioInfo: response.data,
                    };
                  } catch (error) {
                    console.error(`Error obteniendo detalles del servicio con ID ${detalle.id_servicio}:`, error);
                    return {
                      id_servicio: detalle.id_servicio,
                      servicioInfo: null,
                    };
                  }
                })
              ) : [];

              return {
                cita: { ...cita, Fecha_Atencion: fechaAtencion },
                detallesCita,
                nombreBarbero,
                telefonoBarbero,
              };
            })
          );

          console.log("Citas con detalle:", citasConDetalle);

          setCitas(citasConDetalle);
        } else {
          console.error("Error: response.data.citas no es un array");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [tablaActualizada]);


  const isUser1Or2Confirmed = (cita) => {
    return userRoleId === 1 || userRoleId === 2 ? cita.cita.estado === 'Confirmada' : false;
  };

  const isCitaPasada = (fechaAtencion) => {
    const fechaCita = moment(fechaAtencion);
    const fechaActual = moment();
    return fechaCita.isBefore(fechaActual, 'day');
  };

  const TomarCita = async (idCita) => {
    console.log('Tomando cita con ID:', idCita);
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Realmente quieres tomar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Confirmar',
      cancelButtonText: 'No'
    });

    if (confirmacion.isConfirmed) {
      try {
        await CitasDataService.TomarCita(idCita);
        console.log('Cita Confirmada con éxito');
        setTablaActualizada(prevState => !prevState);
        Swal.fire('Éxito', 'La cita se ha tomado exitosamente', 'success');
      } catch (error) {
        console.error('Error al tomar la cita:', error);
        Swal.fire('Error', 'No se pudo tomar la cita', 'error');
      }
    }
  };

  const CancelarCita = async (idCita, idEmpleado) => {
    console.log('Cancelando cita con ID:', idCita);
    const barberoData = await getNombreBarbero(idEmpleado);
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: userRoleId === 3 ? `Si necesitas cancelar con tu barbero ${barberoData.nombre}, comunícate al #  ${barberoData.telefono}.` : '¿Realmente quieres cancelar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Cancelar',
      cancelButtonText: 'No'
    });

    if (confirmacion.isConfirmed) {
      try {
        await CitasDataService.CancelarCita(idCita);  // Adjusted to match the method name
        console.log('Cita Cancelada con éxito');
        setTablaActualizada(prevState => !prevState);
        Swal.fire('Éxito', 'La cita se ha cancelado exitosamente', 'success');
      } catch (error) {
        console.error('Error al cancelar la cita:', error);
        Swal.fire('Error', 'No se pudo cancelar la cita', 'error');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard className="card-style">
            <CCardHeader className="header-style">
              <strong>Lista de Citas</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Empleado</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Hora</CTableHeaderCell>
                    <CTableHeaderCell>Cliente</CTableHeaderCell>
                    <CTableHeaderCell>Hora Fin</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {citas.map((cita, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell><BarberoNombre id_empleado={cita.cita.id_empleado} /></CTableDataCell>
                      <CTableDataCell>{moment.utc(cita.cita.Fecha_Atencion).format('DD-MM-YYYY')}</CTableDataCell>
                      <CTableDataCell>{cita.cita.Hora_Atencion}</CTableDataCell>
                      <CTableDataCell><UsuarioNombre idUser={cita.cita.id_usuario} /></CTableDataCell>
                      <CTableDataCell>{cita.cita.Hora_Fin}</CTableDataCell>
                      <CTableDataCell>
                        {cita.cita.estado === 'Confirmada' ? (
                          <CBadge color="success">Confirmada</CBadge>
                        ) : (
                          cita.cita.estado === 'Cancelada' ? (
                            <CBadge color="danger">Cancelada</CBadge>
                          ) : (
                            <CBadge color="warning">Pendiente</CBadge>
                          )
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {cita.cita.estado === 'Cancelada' ? (
                          <CButton color="secondary" disabled>
                            <FaTimes style={{ marginRight: '5px' }} />
                            Cancelada
                          </CButton>
                        ) : (
                          !isCitaPasada(cita.cita.Fecha_Atencion) && (
                            <>
                              {userRoleId === 3 ? (
                                cita.cita.estado === 'Confirmada' ? (
                                  <CBadge color="success">Confirmada</CBadge>
                                ) : (
                                  <CButton
                                    color={cita.cita.estado === 'Confirmada' ? 'secondary' : 'danger'}
                                    onClick={() => CancelarCita(cita.cita.id_cita, cita.cita.id_empleado)}
                                    style={{ marginRight: '5px' }}
                                    disabled={cita.cita.estado === 'Confirmada'}
                                  >
                                    <FaTimes style={{ marginRight: '5px' }} />
                                    Cancelar
                                  </CButton>
                                )
                              ) : (
                                <>
                                  <CButton
                                    color={cita.cita.estado === 'Confirmada' ? 'secondary' : 'danger'}
                                    onClick={() => CancelarCita(cita.cita.id_cita, cita.cita.id_empleado)}
                                    style={{ marginRight: '5px' }}
                                    disabled={cita.cita.estado === 'Confirmada'}
                                  >
                                    <FaTimes style={{ marginRight: '5px' }} />
                                    Cancelar
                                  </CButton>
                                  {cita.cita.estado !== 'Confirmada' && (
                                    <CButton
                                      color="success"
                                      onClick={() => TomarCita(cita.cita.id_cita)}
                                    >
                                      <FaCheck style={{ marginRight: '5px' }} />
                                      Confirmar
                                    </CButton>
                                  )}
                                </>
                              )}
                            </>
                          )
                        )}
                      </CTableDataCell>



                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CPagination className="justify-content-center" aria-label="Page navigation example">
                <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Anterior</CPaginationItem>
                <CPaginationItem active>{currentPage}</CPaginationItem>
                <CPaginationItem disabled={currentPage === Math.ceil(citas.length / pageSize)} onClick={() => handlePageChange(currentPage + 1)}>Siguiente</CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default ListaCitas;
