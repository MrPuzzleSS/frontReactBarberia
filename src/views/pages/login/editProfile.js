import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CInputGroup, CCardFooter, CInputGroupText, CFormInput, CButton } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faUserEdit, faEdit, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { getUserInfo } from '../../../components/auht'; // Corregí el nombre del archivo
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await getUserInfo();
                setName(userInfo.nombre_usuario || '');
                setEmail(userInfo.correo || '');
                setUserData(userInfo);
            } catch (error) {
                console.error('Error al obtener datos del usuario', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        setIsProfileUpdated(name || email || newPassword || confirmPassword);
    }, [name, email, newPassword, confirmPassword]);

    const handleEdit = (field) => {
        setEditingField(field);
    }

    const validateName = (value) => {
        return /^[a-zA-Z0-9_-]*$/.test(value);
    }

    const validateEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    const validatePassword = (value) => {
        return value.length >= 8;
    }

    const handleUpdateProfile = async () => {
        try {
            if (!isProfileUpdated) {
                setUpdateError('Debes actualizar al menos un campo');
                return;
            }

            if (newPassword && newPassword !== confirmPassword) {
                setUpdateError('Las contraseñas no coinciden');
                return;
            }

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

            Swal.fire({
                icon: 'question',
                title: '¿Estás seguro de que deseas actualizar tus datos?',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    confirmUpdate();
                }
            });
        } catch (error) {
            console.error('Error al realizar la actualización', error);
            setUpdateSuccess(false);
            setUpdateError('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
        }
    }

    const confirmUpdate = async () => {
        try {
            const response = await fetch('http://localhost:8095/api/actualizarPerfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    nombre: name,
                    correo: email,
                    nuevaContrasena: newPassword || null,
                }),
            });
    
            if (response.ok) {
                setUpdateSuccess(true);
                setTimeout(() => {
                    navigate('/login'); // Redireccionar al login después de actualizar el perfil
                }, 3000);
            } else {
                const data = await response.json();
                let errorMessage = '';
                if (data.error && data.error.sqlMessage) {
                    if (data.error.sqlMessage.includes('nombre_usuario')) {
                        errorMessage = 'El nombre de usuario ya está en uso';
                    } else if (data.error.sqlMessage.includes('correo')) {
                        errorMessage = 'El correo electrónico ya está en uso';
                    } else {
                        errorMessage = 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.';
                    }
                } else {
                    errorMessage = 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.';
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el perfil',
                    text: errorMessage,
                });
            }
        } catch (error) {
            console.error('Error al realizar la actualización', error);
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
                                    <div className="input-group">
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Nueva Contraseña"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={editingField !== 'password'}
                                        />
                                        <CButton
                                            color="info"
                                            onClick={() => handleEdit('password')}
                                            disabled={editingField === 'password'}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </CButton>
                                    </div>
                                </CInputGroup>
                                <CInputGroup className="mb-4">
                                    <div className="input-group">
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </button>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Confirmar Nueva Contraseña"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={editingField !== 'confirmPassword'}
                                        />
                                        <CButton
                                            color="info"
                                            onClick={() => handleEdit('confirmPassword')}
                                            disabled={editingField === 'confirmPassword'}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </CButton>
                                    </div>
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
                                    {userData && userData.rol && (
                                        <div className="d-inline-block mx-3">
                                            <Link to={userData.rol.nombre === 'Cliente' ? '/cliente' : '/dashboard'}>
                                                <button className="btn btn-secondary">Regresar</button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
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
