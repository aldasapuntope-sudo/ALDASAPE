import React, { useState, useEffect } from "react";
import '../css/Cargando.css';

export default function Cargando({ visible }) {
  const frases = [
    "Cargando",
    "Espere unos minutos",
    "Preparando todo",
    "Conectando con el servidor",
    "Ajustando los últimos detalles",
  ];

  const [fraseIndex, setFraseIndex] = useState(0);
  const [puntos, setPuntos] = useState("");

  // Animar los puntos suspensivos (...)
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setPuntos((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, [visible]);

  // Cambiar frase cada 5 segundos
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % frases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="preloader-overlay">
      <div className="preloader-spinner">
        <div className="spinner-border text-light" role="status"></div>
        <p className="mt-3 text-light fw-semibold">
          {frases[fraseIndex]}
          {puntos}
        </p>
      </div>
    </div>
  );
}

{/*export default function Cargando({ visible }) {
  if (!visible) return null;

  return (
    <div className="preloader-overlay">
      <div className="preloader-spinner">
        <div className="spinner-border text-light" role="status"></div>
        <p className="mt-3 text-light fw-semibold">Cargando...</p>
      </div>
    </div>
  );
} */}