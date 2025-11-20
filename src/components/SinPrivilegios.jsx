import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../css/Error404.css";

export default function SinPrivilegios() {
  return (
    <div className="error-container">
      <img
        alt="Logo"
        draggable="false"
        src="/assets/images/logo-aldasape-color.png"
        style={{ width: "10%" }}
      />
      <div className="error-code">403</div>
      <div className="error-message">Acceso Denegado</div>
      <p className="error-description">
        No tienes privilegios para acceder a esta sección del sistema.
      </p>

      <Link to="/" className="btn-home">
        <FaHome /> Volver al inicio
      </Link>
    </div>
  );
}
