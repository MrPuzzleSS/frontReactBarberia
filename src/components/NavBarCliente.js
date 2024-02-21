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
// Importa el componente AppHeaderDropdown
import AppHeaderDropdown from '../components/header/AppHeaderDropdown';

const NavBarCliente = () => {
    const [visible, setVisible] = useState(false)
    return (
        <>
        
        <CNavbar expand="lg" colorScheme="dark" className="bg-dark">
          <CContainer fluid>
          <img src={logoBarberia} alt="SION BARBERSHOP" width="9%" />
            <CNavbarToggler
              aria-label="Toggle navigation"
              aria-expanded={visible}
              onClick={() => setVisible(!visible)}
            />
            <CCollapse className="navbar-collapse" visible={visible}>
              <CNavbarNav>
                <CNavItem>
                  <CNavLink href="/cliente/inicio" active>
                    INICIO
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink href="/cliente/reservar">AGENDAR</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink href="/cliente/listacitas">CITAS AGENDADAS</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink href="#">QUIENES SOMOS</CNavLink>
                </CNavItem>
              </CNavbarNav>
              
            </CCollapse>
          </CContainer>
          
        </CNavbar>
        <AppHeaderDropdown> </AppHeaderDropdown>
        </>
    )
}

export default (NavBarCliente)