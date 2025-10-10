// src/pages/login/logica/loginActions.js
import axios from 'axios';
import Swal from 'sweetalert2'
import config from '../../../config';

export const enviarTokenGoogle = async (token) => {
  try {
    const res = await axios.post(`${config.apiUrl}api/Login/auth/google`, { token });
    console.log('token:', token);
    console.log('Respuesta completa del backend (Google):', res);

    if (res.data.success) {
      // ✅ Mensaje de éxito
      Swal.fire({
        title: 'Bienvenido',
        text: res.data.usuarioaldasa?.nombrecompleto || res.data.name,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false, 
        allowOutsideClick: false,
        timerProgressBar: true,
      }).then(() => {
        // window.location.reload(); // Descomenta si deseas recargar
      }); 

      return {
        codigotokenautenticadorunj: res.data.token,
        name: res.data.name,
        email: res.data.email,
        picture: res.data.picture,
        givenName: res.data.givenName,
        familyName: res.data.familyName,
        usuarioaldasa: res.data.usuarioaldasa,
      };
    } else {
      // ⚠️ Error controlado desde el backend
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.data.message || 'Error desconocido del servidor',
      });
    }
  } catch (error) {
    console.error('Error en enviarTokenGoogle:', error);

    if (error.response) {
      // 💬 El backend respondió con error
      console.error('Datos del error:', error.response.data);
      console.error('Status HTTP:', error.response.status);
      console.error('Headers:', error.response.headers);

      Swal.fire({
        icon: 'error',
        title: `Error ${error.response.status}`,
        text: error.response.data.error || error.response.data.message || 'Error en el servidor',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Cerrar',
      });
    } else if (error.request) {
      // 💬 No hubo respuesta del servidor
      console.error('No hubo respuesta del backend:', error.request);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No hubo respuesta del servidor. Verifique su conexión a internet.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Reintentar',
      });
    } else {
      // 💬 Error desconocido
      console.error('Error desconocido:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: error.message,
        confirmButtonColor: '#d33',
      });
    }

    return null;
  }
};

 

export const iniciarSesion = async ({ email, password }) => {
  try {
    const payload = { email, clave: password }; // Login por formulario

    const res = await axios.post(`${config.apiUrl}api/Loginform/auth/google`, payload);

    console.log('Respuesta completa del backend:', res); // ✅ Log para depurar

    if (res.data.success) {
      Swal.fire({
        title: 'Bienvenido',
        text: res.data.usuarioaldasa.nombrecompleto,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false,
        timerProgressBar: true
      }).then(() => {
        window.location.reload();
      });

      return {
        codigotokenautenticadorunj: res.data.token,
        usuarioaldasa: res.data.usuarioaldasa,
      };
    } else {
      Swal.fire('Error', res.data.message, 'error');
    }

  } catch (error) {
    // Mostrar errores más claros
    console.error('Error en iniciarSesion:', error);

    if (error.response) {
      // El backend respondió con un status != 2xx
      console.error('Datos del error:', error.response.data);
      console.error('Status HTTP:', error.response.status);
      console.error('Headers:', error.response.headers);

      Swal.fire({
        icon: 'error',
        title: `Error ${error.response.status}`,
        text: error.response.data.message || 'Error en el servidor',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Cerrar',
      });
    } else if (error.request) {
      // La solicitud se hizo pero no hay respuesta
      console.error('No hubo respuesta del backend:', error.request);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No hubo respuesta del servidor',
      });
    } else {
      // Otro error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }

    return null;
  }
};
