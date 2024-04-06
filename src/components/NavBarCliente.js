import { React, useState } from 'react'
import {
  CContainer,
  CNavLink,
  CNavItem,
  CNavbar,
  CNavbarNav,
  CNavbarToggler,
  CCollapse,
} from '@coreui/react'
import logoBarberia from '../assets/images/logoBarberia2.png'
import AppHeaderDropdownCliente from './header/AppHeaderDropdowncliente';
import 'src/scss/css/global.css'; 

const NavBarCliente = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CNavbar expand="lg" colorScheme="light" style={{ backgroundColor: '#778da9' }}>
        <CContainer fluid>
          <img src={logoBarberia} alt="SION BARBERSHOP" width="12%" />
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav>
              <CNavItem>
                <CNavLink href="/cliente/inicio" active >
                  INICIO
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="/cliente/reservar" style={{ fontWeight: 'bold' }}>RESERVA TU CITA</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="/cliente/listacitas" style={{ fontWeight: 'bold' }}>CITAS AGENDADAS</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#" style={{ fontWeight: 'bold' }}>QUIENES SOMOS</CNavLink>
              </CNavItem>
            </CNavbarNav>
            <CNavbarNav className="ms-auto">
              <AppHeaderDropdownCliente />
            </CNavbarNav>

          </CCollapse>
        </CContainer>

      </CNavbar>
    </>
  )
}

export default (NavBarCliente)