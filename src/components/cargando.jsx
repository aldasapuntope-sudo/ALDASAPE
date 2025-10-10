import React from 'react';
import '../css/Cargando.css';

export default function Cargando({ visible }) {
  if (!visible) return null;

  return (
    <div className="preloader-overlay">
      <div className="preloader-spinner">
        <div className="spinner-border text-light" role="status"></div>
        <p className="mt-3 text-light fw-semibold">Cargando...</p>
      </div>
    </div>
  );
}