import React, { useState } from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { FaFacebook } from "react-icons/fa";
import Swal from "sweetalert2";
import Cargando from "../../../components/cargando";

export default function BotonFacebook({ setUsuario }) {
  const [cargando, setCargando] = useState(false);

  const responseFacebook = async (response) => {
    if (!response.accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar con Facebook',
        text: 'Por favor, intenta nuevamente.',
      });
      return;
    }

    setCargando(true);
    try {
      // Aquí puedes enviar el token al backend, similar a enviarTokenGoogle
      // const userData = await enviarTokenFacebook(response.accessToken);

      const userData = {
        id: response.id,
        name: response.name,
        email: response.email,
        picture: response.picture?.data?.url,
      };

      localStorage.setItem("usuario", JSON.stringify(userData));
      setUsuario(userData);

      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Bienvenido ' + userData.name,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => window.location.reload(), 1800);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error al iniciar sesión con Facebook',
      });
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Cargando visible={cargando} />
      <FacebookLogin
        appId="783811897859933"
        fields="name,email,picture"
        callback={responseFacebook}
        render={({ onClick }) => (
          <button
            className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            onClick={onClick}
            style={{background: '#0866ff'}}
          >
            <FaFacebook /> Iniciar sesión con Facebook
          </button>
        )}
      />
    </>
  );
}
