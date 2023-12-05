import React, { useState, useEffect } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CCardTitle,
  CRow,
  CCol,
  CButton,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CAlert,
} from "@coreui/react";

import Servicios_S from "src/views/services/servicios_s";
import { ServicioBarbero } from "src/views/services/empleadoService";

const AgendarCita = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleLg, setVisibleLg] = useState(false);
  const [showAgendarButton, setShowAgendarButton] = useState(currentPage !== 3);
  const [servicesData, setServicesData] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [tempSelectedServices, setTempSelectedServices] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedBarbero, setSelectedBarbero] = useState(null);
  const [tempSelectedBarberos, setTempSelectedBarberos] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await Servicios_S.getAll();
        setServicesData(response.data.listServicios);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    const fetchBarbero = async () => {
      try {
        const response = await ServicioBarbero.getAll();
        setEmpleados(response.data.empleados);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchServices();
    fetchBarbero();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setShowAgendarButton(newPage !== 3);
  };

  const handleAcceptButtonClick = () => {
    // Guardar los servicios seleccionados en la lista temporal
    setTempSelectedServices(selectedServices);

    // Cerrar el modal
    setVisibleLg(false);
  };

  const handleServiceSelection = (service) => {
    // Verificar si el servicio ya está seleccionado
    const isSelected = selectedServices.some((s) => s.id === service.id);

    if (isSelected) {
      // Si ya está seleccionado, quitarlo de la lista
      setSelectedServices((prevSelectedServices) =>
        prevSelectedServices.filter((s) => s.id !== service.id),
      );
    } else {
      // Si no está seleccionado, agregarlo a la lista
      setSelectedServices((prevSelectedServices) => [
        ...prevSelectedServices,
        service,
      ]);
    }
  };

  const handleBarberoSelection = (barbero) => {
    // Verifica si el barbero ya está en la lista temporal
    const isAlreadySelected = tempSelectedBarberos.some(
      (b) => b.id === barbero.id,
    );

    if (!isAlreadySelected) {
      // Agrega el barbero a la lista temporal
      setTempSelectedBarberos((prevSelectedBarberos) => [
        ...prevSelectedBarberos,
        barbero,
      ]);
    }

    // Cambia a la siguiente página
    handlePageChange(currentPage + 1);
  };

  return (
    <CContainer>
      <h3>Agendar Una Cita</h3>
      <CCard>
        <CCardBody>
          <CPagination align="center" aria-label="Page navigation example">
            <CPaginationItem
              active={currentPage === 1}
              onClick={() => handlePageChange(1)}
            >
              Servicio
            </CPaginationItem>
            <CPaginationItem
              active={currentPage === 2}
              onClick={() => handlePageChange(2)}
            >
              Barbero
            </CPaginationItem>
            <CPaginationItem
              active={currentPage === 3}
              onClick={() => handlePageChange(3)}
            >
              Fecha y Hora
            </CPaginationItem>
          </CPagination>

          <CCardTitle>
            {currentPage === 1 && "Selecciona un Servicio"}
            {currentPage === 2 && "Selecciona un Barbero"}
            {currentPage === 3 && "Selecciona Fecha y Hora"}
          </CCardTitle>

          {currentPage === 1 && (
            <>
              <CButton onClick={() => setVisibleLg(!visibleLg)}>
                Seleccionar Servicios
              </CButton>

              {/* Contenido para seleccionar servicios */}
              {tempSelectedServices.length > 0 ? (
                <CCard className="mt-3">
                  <CCardBody>
                    <CCardTitle>Servicios Seleccionados</CCardTitle>
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">#</CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Nombre
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {tempSelectedServices.map((service, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>{service.nombre}</CTableDataCell>
                            <CTableDataCell>{service.valor}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              ) : (
                <div className="mt-3">
                  <CAlert color="info">
                    No se han seleccionado servicios.
                  </CAlert>
                </div>
              )}

              {/* Modal para seleccionar servicios */}
              <CModal
                size="lg"
                scrollable
                visible={visibleLg}
                onClose={() => setVisibleLg(false)}
                aria-labelledby="ScrollingLongContentExampleLabel2"
              >
                <CModalHeader>
                  <CModalTitle id="ScrollingLongContentExampleLabel2">
                    Seleciona los servicios
                  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CTable>
                    <CTableHead>
                      <CTableRow></CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <tr>
                        {servicesData.map((service) => (
                          <td
                            key={service.id}
                            style={{
                              padding: "8px",
                              border: selectedServices.some(
                                (s) => s.id === service.id,
                              )
                                ? "2px solid #007bff"
                                : "1px solid #ddd",
                            }}
                          >
                            <div style={{ width: "10rem" }}>
                              <div
                                style={{
                                  borderBottom: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                {service.nombre}
                              </div>
                              <div style={{ padding: "8px" }}>
                                Precio: {service.valor}
                              </div>
                              <button
                                style={{
                                  backgroundColor: selectedServices.some(
                                    (s) => s.id === service.id,
                                  )
                                    ? "#007bff"
                                    : "#4caf50",
                                  color: "#fff",
                                  padding: "8px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleServiceSelection(service)}
                              >
                                Seleccionar
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </CTableBody>
                  </CTable>
                </CModalBody>
                <CModalFooter>
                  <CButton
                    color="secondary"
                    onClick={() => setVisibleLg(false)}
                  >
                    Cancelar
                  </CButton>
                  <CButton color="primary" onClick={handleAcceptButtonClick}>
                    Aceptar
                  </CButton>
                </CModalFooter>
              </CModal>
            </>
          )}

          {currentPage === 2 && (
            <CContainer>
              <h3>Barberos Disponibles</h3>
              <CRow>
                {empleados.map((empleado, index) => (
                  <CCol key={index} sm="4">
                    <CCard
                      onClick={() => handleBarberoSelection(empleado)}
                      style={{
                        cursor: "pointer",
                        border:
                          selectedBarbero === empleado
                            ? "2px solid #007bff"
                            : "1px solid #ddd",
                      }}
                    >
                      <CCardBody>
                        <CCardTitle>{empleado.nombre}</CCardTitle>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </CContainer>
          )}

          {currentPage === 3 && (
            // Agrega la lógica para seleccionar fecha y hora aquí
            <p>Contenido para seleccionar fecha y hora...</p>
          )}
        </CCardBody>
      </CCard>
      <CRow className="mt-5">
        <CCol>
          <CButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </CButton>
        </CCol>
        <CCol className="text-right">
          {currentPage === 3 ? (
            <CButton
              onClick={() => {
                // Agrega aquí la lógica para manejar el evento de agendar
                // Por ahora, solo ocultamos el botón
                setShowAgendarButton(false);
              }}
            >
              Agendar
            </CButton>
          ) : (
            <CButton
              disabled={currentPage === 3}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </CButton>
          )}
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AgendarCita;
