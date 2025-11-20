import React, { useEffect, useState, useRef } from 'react';
import '../../../css/PopupPublicidad.css';
import config from '../../../config';

export default function PopupPublicidad({ popups }) {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  const noData = !popups || popups.length === 0;
  const timerRef = useRef(null);

  // 🔁 Slider automático
  useEffect(() => {
    if (!visible) return;
    if (noData) return;
    if (popups.length <= 1) return;

    const slider = setInterval(() => {
      setIndex(prev => (prev + 1) % popups.length);
    }, 3000);

    return () => clearInterval(slider);
  }, [visible, noData, popups]);

  // 🔥 Cerrar popup y reaparición
  const cerrarPopup = () => {
    setVisible(false);
    clearTimeout(timerRef.current);

    const tiempoMilisegundos = (popups[0].tiempo_segundos || 180) * 1000;

    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, tiempoMilisegundos);
  };

  // ⏩ Cambiar imagen manualmente
  const siguiente = () => {
    setIndex(prev => (prev + 1) % popups.length);
  };

  const anterior = () => {
    setIndex(prev => (prev - 1 + popups.length) % popups.length);
  };

  if (noData) return null;

  return (
    <div
      className="popup-overlay"
      style={{ display: visible ? 'flex' : 'none' }}
    >
      <div className="popup-container">

        <button className="popup-close" onClick={cerrarPopup}>
          ✕
        </button>

        {/* ← Flecha izquierda */}
        {popups.length > 1 && (
          <button className="popup-arrow left" onClick={anterior}>
            ◀
          </button>
        )}

        {/* Imagen */}
        <img
          src={`${config.urlserver}${popups[index].imagen_url}`}
          className="popup-img full-image"
          alt="Publicidad"
        />

        {/* → Flecha derecha */}
        {popups.length > 1 && (  
          <button className="popup-arrow right" onClick={siguiente}>
            ▶
          </button>
        )}

      </div>
    </div>
  );
}
