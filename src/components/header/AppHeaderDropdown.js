import React, { useState, useEffect, useRef } from 'react';
import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilUser, cilSettings, cilLockLocked, cilChevronBottom } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getUserInfo, logout } from 'src/components/auht';
import Swal from 'sweetalert2';
import { useProfileImage } from 'src/views/ProfileImageContext';
import defaultAvatar from 'src/assets/images/10.jpg'; 


const AppHeaderDropdown = () => {
  const profileImageContext = useProfileImage();
  const { profileImage, setProfileImage } = profileImageContext || {};

  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log('User Info:', userInfo); // Log para verificar la información del usuario
        setUserName(userInfo.nombre_usuario || '');
        setIsLoggedIn(true);
        if (userInfo.foto) {
          const imagePath = `/uploads/${userInfo.foto}`;
          console.log('Profile Image Path:', imagePath); // Log para verificar la ruta de la imagen del perfil
          setProfileImage(imagePath);
        } else {
          setProfileImage(defaultAvatar); // Establece la imagen predeterminada si no hay imagen de perfil
        }
      } catch (error) {
        console.error('Error al obtener el nombre del usuario', error);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, [setProfileImage]);

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

  const handleChangeProfileImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('foto', file);

        // Define el endpoint correcto basado en el rol del usuario
        const endpoint = userName === 'Admin' ? '/upload/admin-profile' : '/upload/-processed';

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setProfileImage(URL.createObjectURL(file));
          Swal.fire({
            icon: 'success',
            title: 'Imagen actualizada',
            text: 'La imagen de perfil ha sido actualizada con éxito',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al subir la imagen',
            text: data.message || 'Ocurrió un error al subir la imagen',
          });
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al subir la imagen',
          text: 'Ocurrió un error al subir la imagen',
        });
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <strong>
        <a href="/login" className="btn" style={{ backgroundColor: '#b5bcc6', color: 'black', fontWeight: 'bold' }}>Iniciar Sesión</a>
      </strong>
    );
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', position: 'relative', marginRight: '10px' }}>
            <img
              src={profileImage || defaultAvatar}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#00FF00', position: 'absolute', bottom: '0', right: '0', border: '2px solid white' }}></div>
          </div>
          <span style={{ fontSize: '23px', fontWeight: 'bold', color: '#333', marginRight: '10px' }}>{userName}</span>
          <CIcon icon={cilChevronBottom} style={{ fontSize: '20px', color: '#333', cursor: 'pointer' }} />
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
        <CDropdownItem onClick={handleChangeProfileImage}>
          <label className="dropdown-item">
            Cambiar Imagen de Perfil
          </label>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
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