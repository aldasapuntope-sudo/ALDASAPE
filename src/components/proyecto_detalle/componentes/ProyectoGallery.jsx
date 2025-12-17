import React, { useState, useEffect, useRef } from "react";
import config from "../../../config";

export default function ProyectoGallery({ imagenes }) {
  const [index, setIndex] = useState(null);
  const [fade, setFade] = useState(false);
  const touchStartX = useRef(null);

  const abrirModal = (i) => {
    setIndex(i);
    setFade(true);
  };

  const cerrarModal = () => setIndex(null);

  const siguiente = () => {
    if (!imagenes || imagenes.length === 0) return;
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
      setFade(true);
    }, 150);
  };

  const anterior = () => {
    if (!imagenes || imagenes.length === 0) return;
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
      setFade(true);
    }, 150);
  };

  /** Navegación con teclado */
  useEffect(() => {
    const handleKey = (e) => {
      if (index === null) return;
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "Escape") cerrarModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, imagenes]);

  /** Swipe móvil */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) anterior(); // derecha
    if (diff < -50) siguiente(); // izquierda
    touchStartX.current = null;
  };

  if (!imagenes || imagenes.length === 0) return null;

  return (
    <>
      <div className="card shadow-sm border-0 rounded-4 p-4 mt-4">
        <h3 className="item-title mb-3">Galería del Proyecto</h3>

        <div className="row mt-3">
          {imagenes.map((img, i) => (
            <div key={img.id} className="col-md-4 mb-3">
              <div
                className="card shadow-sm border-0 rounded-4 overflow-hidden"
                style={{ cursor: "pointer" }}
                onClick={() => abrirModal(i)}
              >
                <img
                  src={`${config.urlserver}${img.archivo}`}
                  alt={img.titulo}
                  className="img-fluid"
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FULLSCREEN */}
      {index !== null && (
        <div className="gallery-modal" onClick={cerrarModal}>
          <div
            className="gallery-modal-content card shadow-lg"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={`${config.urlserver}${imagenes[index].archivo}`}
              alt=""
              className={`gallery-image ${fade ? "fade-in" : "fade-out"}`}
            />

            <button
              className="btn-prev"
              onClick={(e) => {
                e.stopPropagation();
                anterior();
              }}
            >
              ❮
            </button>

            <button
              className="btn-next"
              onClick={(e) => {
                e.stopPropagation();
                siguiente();
              }}
            >
              ❯
            </button>

            <button
              className="btn-close2"
              onClick={(e) => {
                e.stopPropagation();
                cerrarModal();
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </>
  );
}
