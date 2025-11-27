import React, { useEffect, useState, useRef } from 'react';
import '../../../css/PopupPublicidad.css';
import config from '../../../config';

export default function PopupPublicidad({ popups, configPopup }) {

  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const noData = !popups || popups.length === 0;
  const timerRef = useRef(null);
  const sliderRef = useRef(null);

  // 🔒 Evitar que vuelva a mostrarse cuando el usuario lo cierra
  const yaCerradoRef = useRef(false);


  // 🟦 1. Mostrar popup por primera vez según tiempo de BD
  useEffect(() => {
    if (noData) return;
    if (yaCerradoRef.current) return; // ⛔ No aparecer si ya se cerró

    const tiempoInicio = (configPopup?.[0]?.tiempo_inicio_seg || 5) * 1000;

    timerRef.current = setTimeout(() => {
      if (!yaCerradoRef.current) {
        setVisible(true);
      }
    }, tiempoInicio);

    return () => clearTimeout(timerRef.current);
  }, [noData, configPopup]);


  // 🟩 2. Slider automático según tiempo de cada imagen
  useEffect(() => {
    if (!visible) return;
    if (noData) return;

    const tiempo = (popups[index].tiempo_segundos || 3) * 1000;

    sliderRef.current = setTimeout(() => {
      setIndex(prev => (prev + 1) % popups.length);
    }, tiempo);

    return () => clearTimeout(sliderRef.current);
  }, [visible, index, popups, noData]);


  // 🟥 3. Cerrar popup y evitar que vuelva a aparecer
  const cerrarPopup = () => {
    setVisible(false);
    yaCerradoRef.current = true; // 🔒 Bloqueado hasta refrescar la página

    clearTimeout(timerRef.current);
  };


  // ⏩ Navegación manual
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
