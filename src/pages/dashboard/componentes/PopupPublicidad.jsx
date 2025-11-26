import React, { useEffect, useState, useRef } from 'react';
import '../../../css/PopupPublicidad.css';
import config from '../../../config';

export default function PopupPublicidad({ popups, configPopup }) {
 

  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const noData = !popups || popups.length === 0;
  const timerRef = useRef(null);
  const sliderRef = useRef(null);

  // 🟦 1. Mostrar en primera instancia según tiempo BD
  useEffect(() => {
    if (noData) return;

    const tiempoInicio = (configPopup?.[0]?.tiempo_inicio_seg || 5) * 1000;
    
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, tiempoInicio);

    return () => clearTimeout(timerRef.current);
  }, [noData, configPopup]);


  // 🟩 2. Slider automático controlado por cada popup
  useEffect(() => {
    if (!visible) return;
    if (noData) return;

    const tiempo = (popups[index].tiempo_segundos || 3) * 1000;

    sliderRef.current = setTimeout(() => {
      setIndex(prev => (prev + 1) % popups.length);
    }, tiempo);

    return () => clearTimeout(sliderRef.current);
  }, [visible, index, popups, noData]);


  // 🟥 3. Cerrar popup y reaparición
  const cerrarPopup = () => {
    setVisible(false);

    clearTimeout(timerRef.current);

    const tiempoReaparecer = (configPopup?.tiempo_inicio_seg || 5) * 1000;

    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, tiempoReaparecer);
  };

  // ⏩ Manual
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

        {popups.length > 1 && (
          <button className="popup-arrow left" onClick={anterior}>
            ◀
          </button>
        )}

        <img
          src={`${config.urlserver}${popups[index].imagen_url}`}
          className="popup-img full-image"
          alt="Publicidad"
        />

        {popups.length > 1 && (
          <button className="popup-arrow right" onClick={siguiente}>
            ▶
          </button>
        )}

      </div>
    </div>
  );
}
