import React from "react";
import ReactDOM from "react-dom";

export default function WhatsappModal({
  show,
  onClose,
  email,
  setEmail,
  nombre,
  setNombre,
  telefono,
  setTelefono,
  aceptaTerminos,
  setAceptaTerminos,
  autorizaUso,
  setAutorizaUso,
  formularioValido,
  propiedad,
}) {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className="modal fade show d-block"
      style={{
        background: "rgba(0,0,0,.6)",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          {/* HEADER */}
          <div className="modal-header bg-success">
            <h5 className="modal-title text-white">
              ¡Completa tus datos y encuentra tu próximo hogar!
            </h5>
            <button
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* EMAIL */}
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* NOMBRE */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Nombre"
              value={nombre}
              disabled={!email}
              onChange={(e) => setNombre(e.target.value)}
            />

            {/* TELÉFONO */}
            <input
              type="tel"
              className="form-control mb-3"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
            />

            {/* CHECKS */}
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              <label className="form-check-label">
                Acepto los Términos y Condiciones
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={autorizaUso}
                onChange={(e) => setAutorizaUso(e.target.checked)}
              />
              <label className="form-check-label">
                Autorizo el uso de mi información
              </label>
            </div>

            {/* BOTÓN */}
            <a
              href={
                formularioValido
                  ? `https://wa.me/51${propiedad?.perfilanunciante?.telefono_movil}?text=${encodeURIComponent(
                      `Hola, soy ${nombre}. Mi correo es ${email} y mi teléfono ${telefono}. Estoy interesado en la propiedad: ${propiedad?.titulo}`
                    )}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`btn w-100 ${
                formularioValido ? "btn-success" : "btn-secondary disabled"
              }`}
            >
              Enviar
            </a>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
