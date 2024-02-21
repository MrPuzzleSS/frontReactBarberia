import React from 'react';
import { ClienteContent, AppFooter, NavBarCliente } from '../components/cliente';
import '../assets/css/ClienteLayout.css'; // Importa tu archivo de estilos CSS



const ClienteLayout = () => {
  return (
    <div className="cliente-layout">
      {/* Agrega el componente AppHeaderDropdown aquí */}
   
      
      <NavBarCliente />
      <div className="body flex-grow-12">
        <ClienteContent />
      </div>
      <AppFooter />
    </div>
  );
}

export default ClienteLayout;
