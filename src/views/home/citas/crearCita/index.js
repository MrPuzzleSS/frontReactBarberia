import React, {useState} from 'react';
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
  CTableDataCell
} from '@coreui/react';

const AgendarCita = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [visible, setVisible] = useState(false)

  const servicesData = [
    { id: 1, name: 'Corte de Pelo', price: '$20' },
    { id: 2, name: 'Afeitado', price: '$15' },
    { id: 3, name: 'Barba Diseño', price: '$25' },
    // Añade más servicios según sea necesario
  ];

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    // Cambiar a la siguiente página después de seleccionar el servicio
    setCurrentPage(2);
  };

  const handleBarberSelection = () => {
    // Puedes implementar lógica adicional aquí si es necesario
    // Cambiar a la siguiente página después de seleccionar el barbero
    setCurrentPage(3);
  };

  // Puedes agregar más lógica para la selección de fecha y hora

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
          {currentPage === 1 && 'Selecciona un Servicio'}
          {currentPage === 2 && 'Selecciona un Barbero'}
          {currentPage === 3 && 'Selecciona Fecha y Hora'}
        </CCardTitle>

        {currentPage === 1 && (
          <>
            <CButton onClick={() => setVisible(!visible)}>
              Seleccionar Servicios
            </CButton>

            {/* Contenido para seleccionar servicios */}
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {servicesData.map((service) => (
                  <CTableRow key={service.id}>
                    <CTableHeaderCell scope="row">{service.id}</CTableHeaderCell>
                    <CTableDataCell>{service.name}</CTableDataCell>
                    <CTableDataCell>{service.price}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Modal para seleccionar servicios */}
            <CModal
              scrollable
              visible={visible}
              onClose={() => setVisible(false)}
              aria-labelledby="ScrollingLongContentExampleLabel2"
            >
              <CModalHeader>
                <CModalTitle id="ScrollingLongContentExampleLabel2">
                  Servicios
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  {servicesData.map((service) => (
                    <CCol key={service.id} md="4" className="mb-4">
                      <CCard
                        className={`${
                          selectedService === service ? 'border-primary' : ''
                        }`}
                      >
                        <CCardBody>
                          <h5>{service.name}</h5>
                          <p>Precio: {service.price}</p>
                          <CButton
                            color="primary"
                            onClick={() => handleServiceSelection(service)}
                          >
                            Seleccionar
                          </CButton>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Cerrar
                </CButton>
                <CButton color="primary">Guardar cambios</CButton>
              </CModalFooter>
            </CModal>
          </>
        )}

        {currentPage === 2 && (
          // Agrega la lógica para seleccionar un barbero aquí
          <p>Contenido para seleccionar un barbero...</p>
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
          <CButton
            disabled={currentPage === 3}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
          </CButton>
        </CCol>
      </CRow>
  </CContainer>
  )
}

export default AgendarCita