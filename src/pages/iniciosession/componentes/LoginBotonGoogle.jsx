import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';
import { enviarTokenGoogle } from '../logica/LoginLogica';
import Swal from 'sweetalert2';
import Cargando from '../../../components/cargando';

function BotonGoogle({ setUsuario }) {
  const [cargando, setCargando] = useState(false);

  // Login de Google
  const login = useGoogleLogin({
    flow: 'implicit', 
    onSuccess: async (response) => {
      setCargando(true);
      try {
         console.log(response.credential);
        const userData = await enviarTokenGoogle(response.access_token);
        console.log(userData);
        if (userData) {
          localStorage.setItem('usuario', JSON.stringify(userData));
          setUsuario(userData);

          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido ' + (userData.name || ''),
            timer: 2000,
            showConfirmButton: false,
          });

          setTimeout(() => window.location.reload(), 1800);
        }
      } catch (error) {
        const mensaje = typeof error === 'string' ? error : 'Ocurrió un error al iniciar sesión';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Cerrar',
        });
      } finally {
        setCargando(false);
      }
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar con Google',
        text: 'Por favor, intenta nuevamente.',
      });
    },
  });

  // 🔹 Botón personalizado (reemplaza el <GoogleLogin /> original)
  return (
    <>
      <Cargando visible={cargando} /> 
      <button
        className="btn btn-outline-light w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
        onClick={() => login()}
      >
        <FaGoogle /> Iniciar sesión con Google
      </button>
    </>
  );
}

export default BotonGoogle;
