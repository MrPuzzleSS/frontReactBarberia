import React, { useState, useEffect } from 'react';
import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilUser, cilSettings, cilLockLocked } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { logout, getUserInfo } from '../../components/auht';
import Swal from 'sweetalert2';

const AppHeaderDropdown = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userInfo = await getUserInfo();
        setUserName(userInfo.nombre_usuario || '');
      } catch (error) {
        console.error('Error al obtener el nombre del usuario', error);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar la sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        window.location.href = '/login'; // Redireccionar a la página de inicio de sesión
      }
    });
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CIcon icon={cilUser} className="me-2" style={{ fontSize: '50px', color: '#000' }} />
          <span style={{ fontSize: '23px', fontWeight: 'bold', color: '#333' }}>{userName}</span>
          <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#00FF00', marginLeft: '10px' }}></div>
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem href="/UserInfo">
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownItem href="/EditProfile">
          <CIcon icon={cilSettings} className="me-2" />
          Configuración
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
