import React, { useState } from "react";
import {
  FaPlus,
  FaMinus,
  FaTimes,
  FaSearchPlus,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import config from "../../../config";

export default function FloorPlans({ anuncio }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  if (!anuncio?.planos?.length) {
    return (
      <div className="overview-area floor-plan-box mt-1">
        <h3 className="item-title">
          Planos de <strong>{anuncio.tipo_propiedad}</strong>
        </h3>
        <div className="alert alert-warning text-center" role="alert">
          No hay planos disponibles para este anuncio.
        </div>
      </div>
    );
  }

  const planos = anuncio.planos;

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setZoom(1);
  };

  const closeFullscreen = () => setFullscreenIndex(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 1));

  const handleDownload = (plano) => {
    const link = document.createElement("a");
    const url = plano.imagen.startsWith("http")
      ? plano.imagen
      : `${config.urlserver}planos/${plano.imagen}`;
    link.href = url;
    link.download = plano.titulo || "plano.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextImage = () => {
    setZoom(1);
    setFullscreenIndex((prev) => (prev + 1) % planos.length);
  };

  const prevImage = () => {
    setZoom(1);
    setFullscreenIndex((prev) =>
      prev === 0 ? planos.length - 1 : prev - 1
    );
  };

  return (
    <div className="overview-area floor-plan-box mt-1">
      <h3 className="item-title">Planos de {anuncio.tipo_propiedad}</h3>

      <div className="accordion" id="accordion">
        {planos.map((plano, index) => (
          <div className="card mb-2 border rounded shadow-sm" key={index}>
            <div className="card-header">
              <div
                className={`heading-title d-flex justify-content-between align-items-center ${
                  activeIndex === index ? "" : "collapsed"
                }`}
                onClick={() =>
                  setActiveIndex(activeIndex === index ? -1 : index)
                }
                role="button"
                aria-expanded={activeIndex === index}
              >
                <span className="fw-bold">
                  {plano.titulo || `Plano ${index + 1}`}
                </span>

                <div className="card-list flex-grow-1 ms-3 me-3">
                  <ul className="list-inline mb-0 d-flex align-items-center gap-3 flex-wrap">
                    {plano.caracteristicas?.length > 0 ? (
                      plano.caracteristicas.map((car, i) => (
                        <li key={i} className="list-inline-item">
                            <img
                                src={`${config.urlserver}iconos/${car.icono}`}
                                //src={car.icono} // 👈 aquí va la URL del icono (por ejemplo http://localhost/iconos/sofa.png)
                                alt={car.nombre}
                                width="20"
                                height="20"
                                style={{ objectFit: "contain" }}
                                />
                          <span>
                            {car.nombre}: <strong>{car.valor}</strong>
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="list-inline-item ">
                        Sin características
                      </li>
                    )}
                  </ul>
                </div>

                <div className="ms-auto">
                  {activeIndex === index ? (
                    <FaMinus size={18} className="text-secondary" />
                  ) : (
                    <FaPlus size={18} className="text-secondary" />
                  )}
                </div>
              </div>
            </div>

            <div
              className={`collapse ${activeIndex === index ? "show" : ""}`}
              data-bs-parent="#accordion"
            >
              <div className="card-body text-center">
                <div
                  className="item-img"
                  style={{ cursor: "pointer" }}
                  onClick={() => openFullscreen(index)}
                >
                  <img
                    src={
                      plano.imagen.startsWith("http")
                        ? plano.imagen
                        : `${config.urlserver}planos/${plano.imagen}`
                    }
                    alt={`${plano.titulo || "Plano"} ${anuncio.titulo}`}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "350px", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🖼️ Fullscreen Viewer */}
      {fullscreenIndex !== null && (
        <div
            className="fullscreen-viewer"
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            zIndex: 9999,
            }}
            onClick={closeFullscreen} // 👈 si haces clic en el fondo, se cierra
        >
            <div
            onClick={(e) => e.stopPropagation()} // 👈 evita que se cierre al hacer clic dentro
            style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                flexDirection: "column",
            }}
            >
            {/* 🔘 Botones superiores */}
            <div
                className="fullscreen-controls"
                style={{
                position: "absolute",
                top: 20,
                right: 30,
                display: "flex",
                gap: "15px",
                color: "#fff",
                zIndex: 10000,
                }}
            >
                <FaSearchPlus
                title="Ampliar"
                size={22}
                style={{ cursor: "pointer" }}
                onClick={handleZoomIn}
                />
                <FaMinus
                title="Reducir"
                size={22}
                style={{ cursor: "pointer" }}
                onClick={handleZoomOut}
                />
                <FaDownload
                title="Descargar"
                size={22}
                style={{ cursor: "pointer" }}
                onClick={() => handleDownload(planos[fullscreenIndex])}
                />
                <FaTimes
                title="Cerrar"
                size={22}
                style={{ cursor: "pointer" }}
                onClick={closeFullscreen}
                />
            </div>

            {/* 🏷️ Título */}
            <div
                style={{
                position: "absolute",
                top: 20,
                left: 30,
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.2rem",
                }}
            >
                {planos[fullscreenIndex].titulo ||
                `Plano ${fullscreenIndex + 1} ${anuncio.titulo}`}
            </div>

            {/* ⬅️➡️ Navegación */}
            {planos.length > 1 && (
                <>
                <FaChevronLeft
                    onClick={prevImage}
                    size={40}
                    color="#fff"
                    style={{
                    position: "absolute",
                    left: 25,
                    cursor: "pointer",
                    zIndex: 10000,
                    }}
                />
                <FaChevronRight
                    onClick={nextImage}
                    size={40}
                    color="#fff"
                    style={{
                    position: "absolute",
                    right: 25,
                    cursor: "pointer",
                    zIndex: 10000,
                    }}
                />
                </>
            )}

            {/* 📸 Imagen con zoom */}
            <img
                src={
                planos[fullscreenIndex].imagen.startsWith("http")
                    ? planos[fullscreenIndex].imagen
                    : `${config.urlserver}planos/${planos[fullscreenIndex].imagen}`
                }
                alt="Plano"
                style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.3s ease",
                maxWidth: "90%",
                maxHeight: "85%",
                objectFit: "contain",
                cursor: "zoom-in",
                borderRadius: "5px",
                }}
            />
            </div>
        </div>
        )}

    </div>
  );
}
