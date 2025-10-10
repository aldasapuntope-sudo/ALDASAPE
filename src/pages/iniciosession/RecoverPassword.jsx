import React from 'react';
import '../../css/Login.css';

export default function RecoverPassword() {
  return (
    <div className="auth-page">
      <div className="auth-overlay"></div>
      <div className="auth-container">
        <div className="auth-card shadow-lg rounded-4 p-4">
          <h2 className="text-center mb-4 fw-bold text-success">Recuperar Contraseña</h2>

          <form>
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico registrado</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="tuemail@ejemplo.com"
              />
            </div>

            <button type="submit" className="btn btn-success w-100 py-2 fw-semibold mt-2">
              Enviar enlace de recuperación
            </button>
          </form>

          <div className="text-center mt-3 text-white">
            <a href="/login" className="text-success fw-semibold">Volver al inicio de sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
}
