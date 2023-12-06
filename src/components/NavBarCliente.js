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
                  <CNavLink href="#" active>
                    INICIO
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink href="/cliente/reservar">RESERVAS</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink href="#">QUIENES SOMOS</CNavLink>
                </CNavItem>
              </CNavbarNav>
            </CCollapse>
          </CContainer>
        </CNavbar>
        </>
    )
}

export default (NavBarCliente)