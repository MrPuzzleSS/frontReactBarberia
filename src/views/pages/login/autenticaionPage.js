/*import React, { useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CForm, CInputGroup, CInputGroupText, CFormInput, CButton } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import fondo from '../../../assets/images/ig/barberia.jpeg';
import { useNavigate } from 'react-router-dom';

const AuthenticationPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAuthentication = () => {
        // Realizar la validación de la contraseña aquí
        if (password === 'contraseña_del_usuario') {
            // Contraseña correcta, redirigir a la página de edición del perfil
            navigate('/edit-profile');
        } else {
            // Contraseña incorrecta, mostrar mensaje de error
            setError('Contraseña incorrecta');
        }
    }

    return (
        <div
            className="min-vh-100 d-flex flex-row align-items-center"
            style={{
                backgroundImage: `url(${fondo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <CContainer className="text-center">
                <CRow className="justify-content-center">
                    <CCol md={4}>
                        <CCard>
                            <CCardBody>
                                <CForm>
                                    <h3 className="mb-4">Autenticación Requerida</h3>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <FontAwesomeIcon icon={faUnlockAlt} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="password"
                                            placeholder="Contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </CInputGroup>
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    <CButton color="primary" className="w-100" onClick={handleAuthentication}>
                                        Iniciar Sesión
                                    </CButton>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default AuthenticationPage;
*/