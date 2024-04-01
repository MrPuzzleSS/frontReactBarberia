

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono sólido de Excel
import * as XLSX from 'xlsx';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Formatea la fecha a un formato legible local
};

const EventReport = ({ events }) => {
  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Crear una hoja de cálculo a partir de los datos de los eventos
    const wsData = events.map(event => [
      event.title,
      formatDate(event.start),
      event.end ? formatDate(event.end) : 'No hay fecha de fin',
      event.horaInicio,
      event.horaFin,
      event.empleado
    ]);

    const ws = XLSX.utils.aoa_to_sheet([['Título', 'Fecha de inicio', 'Fecha de fin', 'Hora de inicio', 'Hora de fin', 'Empleado'], ...wsData]);
    XLSX.utils.book_append_sheet(workbook, ws, 'Eventos');

    // Guardar la hoja de cálculo como archivo Excel
    XLSX.writeFile(workbook, 'reporte_eventos.xlsx');
  };

  return (
    <div style={{ textAlign: 'right' }}>
      <button onClick={handleDownloadExcel} style={{ backgroundColor: '#9eA3BA', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 30px' }}>
        <FontAwesomeIcon icon={faFileExcel} style={{ marginRight: '5px' }} />
        Excel
      </button>
    </div>
  );
};

EventReport.propTypes = {
  events: PropTypes.array.isRequired,
};

export default EventReport;
