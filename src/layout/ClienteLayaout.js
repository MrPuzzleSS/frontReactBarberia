import React from 'react'
import { ClienteContent, AppFooter, NavBarCliente} from '../components/cliente'

const ClienteLayaout = () => {
  return (
    <div>
      <NavBarCliente/>
        <div className="body flex-grow-12">
            <ClienteContent/>
        </div>
        <AppFooter/>
    </div>
  )
}

export default ClienteLayaout