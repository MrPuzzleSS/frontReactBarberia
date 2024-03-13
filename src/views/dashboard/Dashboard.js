import React from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import barberiainicio from 'src/assets/images/barberiainicio.jpg'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginRight: '16px', marginLeft: '120px', fontFamily: 'Alegreya'}}>
        <h1 style={{ margin: '0' }}>¡BIENVENIDO!</h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '16px' }}>Barbershop</p>
      </div>
      <div style={{ alignSelf: 'center', marginLeft: 'auto' }}>
        <img src={barberiainicio} alt="Barberia Inicio" style={{ width: '140%', height: 'auto' }} />
      </div>
    </div>
  );
}

export default Dashboard;