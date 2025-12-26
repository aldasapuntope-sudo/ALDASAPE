import React, { useEffect, useState } from 'react';
import '../../css/Login.css';
import BotonGoogle from './componentes/LoginBotonGoogle';
import Formulario from './componentes/LoginForm';
import BotonFacebook from './componentes/BotonFacebook';
import HeaderAldasa from '../../components/Header';
import CerrarSesionModal from '../../components/modales/CerrarSesionModal';
import Footerblanco from '../../components/Footerblanco';


export default function Login() {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [usuario, setUsuario] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModalCerrarSesion = () => setMostrarModal(true);

  const confirmarCerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    window.location.href = "/";
  };

  useEffect(() => {
    document.body.style.backgroundImage = "url('image/back-03_0002.svg')";
    const data = localStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));
  }, []);


  return (

    <>
      <HeaderAldasa abrirModal={abrirModalCerrarSesion} />
    
      <div className="auth-page">
        <div className="auth-overlay"></div>
        <div className="auth-container">
          <div className="auth-card shadow-lg rounded-4 p-4">
            <h2 className="text-center mb-4 fw-bold text-success">Iniciar sesión</h2>

            {/* Formulario de correo y contraseña */}
            <Formulario />

            <div className="text-center my-3 text-black-50"></div>

            {/* Botón de Google */}
            <BotonGoogle setUsuario={setUsuario} />
            
            <div className="my-2 text-center text-black-50">o</div>
            <BotonFacebook setUsuario={setUsuario} />
            <div className="text-center mt-3 text-black">
              <small>¿No tienes una cuenta?</small> <br />
              <a href="/registro" className="text-success fw-semibold">Regístrate</a>
            </div>
          </div>

          {/* 🔹 Alerta visual de Bootstrap */}
          {alert.show && (
            <div
              className={`alert alert-${alert.type} alert-dismissible fade show position-fixed bottom-0 start-50 translate-middle-x mb-3 w-75`}
              role="alert"
              style={{ zIndex: 9999 }}
            >
              {alert.message}
              <button
                type="button"
                className="btn-close"
                onClick={() => setAlert({ show: false })}
              ></button>
            </div>
          )}
        </div>
      </div>

      <Footerblanco />

      <CerrarSesionModal
        show={mostrarModal}
        onConfirm={confirmarCerrarSesion}
        onCancel={() => setMostrarModal(false)}
      />
    </>
  );
}
