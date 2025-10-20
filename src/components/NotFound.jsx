// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import '../css/Error404.css';

export default function NotFound() {
  return (
    <div className="error-container">
    <img alt="Logo UNJ" draggable="false" src="/assets/images/logo-aldasape-color.png" style={{width: '10%'}}></img>
      <div className="error-code">404</div>
      <div className="error-message">¡Oops! Página no encontrada</div>
      <p className="error-description">
        Lo sentimos, el anuncio o la página que estás buscando no existe o fue eliminada.
      </p>
      <Link to="/" className="btn-home">
        <FaHome /> Volver al inicio
      </Link>
    </div>
    /*<section className="d-flex flex-column align-items-center justify-content-center text-center py-5">
        <img alt="Logo UNJ" draggable="false" src="image/logo/logo-unj-v1.svg"></img>
      <h1 className="display-3 fw-bold text-danger mb-3">404</h1>
      <h3 className="fw-semibold mb-2">Página no encontrada</h3>
      <p className="text-muted mb-4">
        Lo sentimos, el anuncio o la página que estás buscando no existe o fue eliminada.
      </p>
      <Link to="/" className="btn btn-success d-flex align-items-center gap-2">
        <FaHome /> Volver al inicio
      </Link>
    </section>*/
  );
}
