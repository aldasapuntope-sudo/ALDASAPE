import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/Login.css';
import config from '../../config';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${config.apiUrl}api/forgot-password`, { email });

      Swal.fire({
        title: '¡Correo enviado!',
        text: res.data.message || 'Revisa tu bandeja de entrada para continuar con la recuperación.',
        icon: 'success',
        confirmButtonColor: '#198754', // verde Bootstrap
      });

      setEmail('');
    } catch (error) {
      console.error("Error en la respuesta:", error.response?.data);

      const mensaje =
        error.response?.data?.errors?.email?.[0] ||
        error.response?.data?.message ||
        'No se pudo enviar el enlace. Inténtalo nuevamente.';

      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'error',
        confirmButtonColor: '#dc3545',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay"></div>
      <div className="auth-container">
        <div className="auth-card shadow-lg rounded-4 p-4">
          <h2 className="text-center mb-4 fw-bold text-success">Recuperar Contraseña</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico registrado</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold mt-2"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>

          <div className="text-center mt-3 text-white">
            <a href="/login" className="text-success fw-semibold">
              Volver al inicio de sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
