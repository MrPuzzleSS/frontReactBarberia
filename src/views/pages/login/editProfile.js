import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CInputGroup, CCardFooter, CInputGroupText, CFormInput, CButton } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCheck, faUserEdit, faEdit } from '@fortawesome/free-solid-svg-icons';
import fondo from '../../../assets/images/ftos/ji.jpg';
import { getUserInfo } from '../../../components/auht'; // Corregí el nombre del archivo
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';




const EditProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await getUserInfo();
                setName(userInfo.nombre_usuario || '');
                setEmail(userInfo.correo || '');
            } catch (error) {
                console.error('Error al obtener datos del usuario', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        // Habilitar o deshabilitar el botón de "Actualizar Perfil" según si se han realizado cambios
        setIsProfileUpdated(name || email || newPassword || confirmPassword);
    }, [name, email, newPassword, confirmPassword]);

    const handleEdit = (field) => {
        setEditingField(field);
    }

    const validateName = (value) => {
        return /^[a-zA-Z\s]*$/.test(value);
    }

    const validateEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    const validatePassword = (value) => {
        return value.length >= 8;
    }

    const handleUpdateProfile = async () => {
        try {
            // Verificar si se han realizado cambios
            if (!isProfileUpdated) {
                setUpdateError('Debes actualizar al menos un campo');
                return;
            }

            // Verificar si se ingresaron contraseñas y si coinciden
            if (newPassword && newPassword !== confirmPassword) {
                setUpdateError('Las contraseñas no coinciden');
                return;
            }

            // Validar campos de nombre, correo y contraseña
            if (name && !validateName(name)) {
                setUpdateError('El nombre solo puede contener letras y espacios');
                return;
            }

            if (email && !validateEmail(email)) {
                setUpdateError('Ingrese un correo electrónico válido');
                return;
            }

            if (newPassword && !validatePassword(newPassword)) {
                setUpdateError('La contraseña debe tener al menos 8 caracteres');
                return;
            }

            // Mostrar alerta de confirmación
            setShowConfirmationAlert(true);
        } catch (error) {
            console.error('Error al realizar la actualización', error);
            setUpdateSuccess(false);
            setUpdateError('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
        }
    }

    const confirmUpdate = async () => {
        try {
            const response = await fetch('https://restapibarberia.onrender.com/api/actualizarPerfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    nombre: name,
                    correo: email,
                    nuevaContrasena: newPassword || null, // Si newPassword es null, no se incluirá en la solicitud
                }),
            });

            if (response.ok) {
                setUpdateSuccess(true);
                setShowConfirmationAlert(false);
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // Retraso de 3 segundos antes de redirigir al usuario
            } else {
                setUpdateSuccess(false);
                setUpdateError('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al realizar la actualización', error);
            setUpdateSuccess(false);
            setUpdateError('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
        }
    }


    return (
        <div className="min-vh-100 d-flex flex-row align-items-center">
            <CContainer className="text-center">
                <CRow className="justify-content-center">
                    <CCol md={7}>
                        <CCard style={{ marginTop: '-290px' }}>
                            <CCardHeader className="bg-dark text-white">
                                <CRow className="justify-content-between align-items-center">
                                    <CCol>
                                        <h1 className="display-8 mb-0 font-weight-bold">Editar perfil</h1>
                                    </CCol>
                                    <CCol xs="auto">
                                        <FontAwesomeIcon icon={faUserEdit} style={{ fontSize: '2rem' }} />
                                    </CCol>
                                </CRow>
                            </CCardHeader>
                            <CCardBody className="text-md">
                                <CInputGroup className="mb-4">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faUser} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="text"
                                        placeholder="Nombre"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={editingField !== 'name'}
                                        className={!validateName(name) ? 'is-invalid' : ''}
                                    />
                                    <CButton
                                        color="info"
                                        onClick={() => handleEdit('name')}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </CButton>
                                </CInputGroup>
                                <CInputGroup className="mb-4">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="email"
                                        placeholder="Correo"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={editingField !== 'email'}
                                        className={!validateEmail(email) ? 'is-invalid' : ''}
                                    />
                                    <CButton
                                        color="info"
                                        onClick={() => handleEdit('email')}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </CButton>
                                </CInputGroup>
                                <CInputGroup className="mb-4">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="password"
                                        placeholder="Nueva Contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <CButton
                                        color="info"
                                        onClick={() => handleEdit('password')}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </CButton>
                                </CInputGroup>
                                <CInputGroup className="mb-4">
                                    <CInputGroupText>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="password"
                                        placeholder="Confirmar Nueva Contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={editingField !== 'confirmPassword'}
                                    />
                                    <CButton
                                        color="info"
                                        onClick={() => handleEdit('confirmPassword')}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </CButton>
                                </CInputGroup>
                            </CCardBody>
                            <CCardFooter className="text-center">


                                <CButton
                                    color="primary"
                                    onClick={handleUpdateProfile}
                                    disabled={!isProfileUpdated}
                                >
                                    Actualizar Perfil
                                </CButton>
                                <div className="d-inline-block mx-3">
                                    <Link to="/dashboard">
                                        <button className="btn btn-secondary">REGRESAR</button>
                                    </Link>
                                </div>
                                <div className="d-inline-block mx-3">

                                </div>




                                {showConfirmationAlert && (
                                    <div className="alert alert-warning mt-3" role="alert">
                                        ¿Estás seguro de que deseas actualizar tus datos?
                                        <button className="btn btn-warning ml-2" onClick={confirmUpdate}>Sí</button>
                                    </div>
                                )}
                                {updateSuccess && (
                                    <div className="alert alert-success mt-3" role="alert">
                                        Datos actualizados correctamente. Por favor, inicia sesión nuevamente con tus nuevos datos.
                                    </div>
                                )}
                                {!updateSuccess && updateError && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {updateError}
                                    </div>
                                )}
                            </CCardFooter>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );

};

export default EditProfilePage;
