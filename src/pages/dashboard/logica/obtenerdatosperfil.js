import axios from 'axios';
import config from "../../../config";

export const obtenerdatosperfil = async (codigo) => {
  try {
    const res = await axios.get(`${config.apiUrl}api/miperfil/${codigo}`);

    if (Array.isArray(res.data) && res.data.length > 0) {
      return { datos: res.data, mensaje: '' };
    } else {
      return { datos: [], mensaje: res.data.mensaje || 'No se encontraron datos del alumno.' };
    }
  } catch (err) {
    console.error('Error al obtener datos del alumno:', err);
    return { datos: null, mensaje: 'Error al conectar con el servidor o token inválido.' }; // ✅ siempre retorna objeto
  }
};

export const actualizarPerfil = async (idUsuario, datos) => {
  try {
    console.log("📤 Enviando datos a API:", datos);

    const res = await axios.put(`${config.apiUrl}api/miperfil/actualizar/${idUsuario}`, datos);

    console.log("📡 Respuesta completa de API:", res);

    // Verificamos que tenga data y mensaje
    if (res.status === 200 && res.data) {
      return {
        exito: true,
        mensaje: res.data.mensaje || "Perfil actualizado correctamente",
        data: res.data.data || null, // si hay datos extra
      };
    } else {
      return {
        exito: false,
        mensaje: "No se pudo actualizar el perfil correctamente.",
      };
    }
  } catch (err) {
    console.error("❌ Error al actualizar perfil:", err);

    let mensajeError = "Error desconocido al actualizar perfil";

    if (err.response) {
      console.error("🧱 Error del servidor:", err.response);
      mensajeError = err.response.data?.mensaje || `Error ${err.response.status}`;
    } else if (err.request) {
      console.error("🌐 No hubo respuesta del servidor:", err.request);
      mensajeError = "No se recibió respuesta del servidor.";
    } else {
      console.error("⚙️ Error al configurar la solicitud:", err.message);
      mensajeError = err.message;
    }

    return { exito: false, mensaje: mensajeError };
  }
};
