import React, { useState, useEffect } from "react";
import CitasDataService from "src/views/services/citasService";
import Servicios_S from "src/views/services/servicios_s";
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { FaTimes, FaCheck } from 'react-icons/fa';
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
import PropTypes from 'prop-types';
import { getUserInfo } from '../../../../components/auht';

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

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log("User ID:", userInfo.userId);
        setUserId(userInfo.userId);

        let response;
        if (userInfo.userType === 1) {
          const response1 = await CitasDataService.getAllCitasServicios(2);
          const response2 = await CitasDataService.getAllCitasServicios(3);
          const citasData = response1.data.concat(response2.data);
          response = { data: { citas: citasData } };
        } else if (userInfo.userType === 2) {
          response = await CitasDataService.getEmpleadoConCitas(userInfo.userId);
        } else {
          response = await CitasDataService.getAllCitasServicios(userInfo.userId);
        }

        if (Array.isArray(response.data?.citas)) {
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
                cita,
                detallesCita,
                nombreBarbero,
                telefonoBarbero,
              };
            }),
          );

          if (userInfo.userType === 2) {
            const citasEmpleado = citasConDetalle.filter(cita => cita.cita.id_empleado === userInfo.userId);
            setCitas(citasEmpleado);
          } else {
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

  const TomarCita = async (idCita) => {
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
        console.log('Tomando cita con ID:', idCita);
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
    const barberoData = await getNombreBarbero(idEmpleado);



    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: userId === 3 ? `Si necesitas cancelar con tu barbero ${barberoData.nombre}, comunícate con él al ${barberoData.telefono}.` : '¿Realmente quieres cancelar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Cancelar',
      cancelButtonText: 'No'
    });

    if (confirmacion.isConfirmed) {
      try {
        console.log('Cancelando cita con ID:', idCita);
        await CitasDataService.CancelarCita(idCita);
        console.log('Cita cancelada con éxito');
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

  const UsuarioNombre = ({ idUser }) => {
    const [nombre, setNombre] = useState('');

    useEffect(() => {
      const fetchNombre = async () => {
        const nombreUsuario = await CitasDataService.getUsuario(idUser);
        setNombre(nombreUsuario.data.nombre_usuario);
      };
      fetchNombre();
    }, [idUser]);

    return <>{nombre}</>;
  };

  const isUser1Or2Confirmed = (cita) => {
    return cita.cita.estado === 'Confirmada' && (userId === 1 || userId === 2);
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
                      <CTableDataCell>{format(new Date(cita.cita.Fecha_Atencion.substring(0, 10)), "dd/MM/yyyy")}</CTableDataCell>
                      <CTableDataCell>{cita.cita.Hora_Atencion}</CTableDataCell>
                      <CTableDataCell> <UsuarioNombre idUser={cita.cita.id_usuario} /></CTableDataCell>
                      <CTableDataCell>{cita.cita.Hora_Fin}</CTableDataCell>
                      <CTableDataCell>
                        <span
                          className={`btn ${cita.cita.estado === 'Cancelada' ? 'btn-danger' : cita.cita.estado === 'Confirmada' ? 'btn-success' : isUser1Or2Confirmed(cita) ? 'btn-success' : 'btn-warning'}`}
                          style={{ cursor: 'default' }}
                        >
                          {cita.cita.estado === 'Cancelada' ? 'Cancelada' : cita.cita.estado === 'Confirmada' ? 'Confirmada' : isUser1Or2Confirmed(cita) ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        {cita.cita.estado !== 'Cancelada' && cita.cita.estado !== 'Confirmada' && (
                          <>
                            {userId === 3 && (
                              <CButton
                                color="danger"
                                onClick={() => CancelarCita(cita.cita.id_cita, cita.cita.id_empleado)}
                                style={{ marginRight: '5px' }}
                              >
                                <FaTimes style={{ marginRight: '5px' }} />
                                Cancelar
                              </CButton>
                            )}
                            {(userId === 1 || userId === 2) && (
                              <>
                                <CButton
                                  color="danger"
                                  onClick={() => CancelarCita(cita.cita.id_cita, cita.cita.id_empleado)}
                                  style={{ marginRight: '5px' }}
                                >
                                  <FaTimes style={{ marginRight: '5px' }} />
                                  Cancelar
                                </CButton>
                                <CButton
                                  color="success"
                                  onClick={() => TomarCita(cita.cita.id_cita)}
                                  disabled={cita.cita.estado === 'Confirmada'}
                                  style={{ marginRight: '5px' }}
                                >
                                  <FaCheck style={{ marginRight: '5px' }} />
                                  Confirmar
                                </CButton>
                              </>
                            )}
                          </>
                        )}
                        {cita.cita.estado === 'Confirmada' && (
                          <CButton color="secondary" disabled style={{ marginRight: '5px' }}>
                            <FaCheck style={{ marginRight: '5px' }} />
                            Confirmada
                          </CButton>
                        )}
                        {cita.cita.estado === 'Cancelada' && (
                          <CButton color="secondary" disabled style={{ marginRight: '5px' }}>
                            <FaTimes style={{ marginRight: '5px' }} />
                            Cancelada
                          </CButton>
                        )}
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
