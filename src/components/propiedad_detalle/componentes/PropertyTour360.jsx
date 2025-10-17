import React, { useState } from "react";
import {
  FaPlus,
  FaMinus,
  FaTimes,
  FaSearchPlus,
  FaMinus as FaZoomOut,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function PropertyTour360({ anuncio }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  if (!anuncio?.imagen360?.length) {
    return (
      <div className="overview-area mt-1">
        <h3 className="item-title">Recorridos Virtuales 360°</h3>
        <div className="alert alert-warning text-center" role="alert">
          No hay recorridos virtuales disponibles para este inmueble.
        </div>
      </div>
    );
  }

  const tours = anuncio.imagen360;

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setZoom(1);
  };

  const closeFullscreen = () => setFullscreenIndex(null);
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 1));
  const nextTour = () => setFullscreenIndex((prev) => (prev + 1) % tours.length);
  const prevTour = () =>
    setFullscreenIndex((prev) => (prev === 0 ? tours.length - 1 : prev - 1));
  const handleDownload = (tour) => {
    const link = document.createElement("a");
    link.href = tour.imagen;
    link.download = tour.titulo || "tour360.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="overview-area  floor-plan-box mt-1">
      <h3 className="item-title">Recorridos Virtuales 360°</h3>

      <div className="accordion" id="accordion360">
        {tours.map((tour, index) => (
          <div className="card mb-2 border rounded shadow-sm" key={tour.id || index}>
            <div className="card-header">
              <div
                className={`heading-title d-flex justify-content-between align-items-center ${
                  activeIndex === index ? "" : "collapsed"
                }`}
                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                role="button"
                aria-expanded={activeIndex === index}
              >
                <span className="fw-bold">
                  {tour.titulo || `Tour Virtual ${index + 1}`}
                </span>
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
              data-bs-parent="#accordion360"
            >
              <div className="card-body text-center">
                <div
                  className="item-img"
                  style={{ cursor: "pointer" }}
                  onClick={() => openFullscreen(index)}
                >
                  <iframe
                    width="100%"
                    height="300"
                    allowFullScreen
                    style={{ border: "none", borderRadius: "8px" }}
                    src={`https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${encodeURIComponent(
                      tour.imagen
                    )}`}
                    title={tour.titulo || `Tour 360 ${index + 1}`}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Viewer */}
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
          onClick={closeFullscreen}
        >
          <div
            onClick={(e) => e.stopPropagation()}
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
            {/* Controles */}
            <div
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
              <FaSearchPlus size={22} style={{ cursor: "pointer" }} onClick={handleZoomIn} />
              <FaZoomOut size={22} style={{ cursor: "pointer" }} onClick={handleZoomOut} />
              <FaDownload
                size={22}
                style={{ cursor: "pointer" }}
                onClick={() => handleDownload(tours[fullscreenIndex])}
              />
              <FaTimes size={22} style={{ cursor: "pointer" }} onClick={closeFullscreen} />
            </div>

            {/* Título */}
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
              {tours[fullscreenIndex].titulo || `Tour ${fullscreenIndex + 1}`}
            </div>

            {/* Navegación */}
            {tours.length > 1 && (
              <>
                <FaChevronLeft
                  onClick={prevTour}
                  size={40}
                  color="#fff"
                  style={{ position: "absolute", left: 25, cursor: "pointer", zIndex: 10000 }}
                />
                <FaChevronRight
                  onClick={nextTour}
                  size={40}
                  color="#fff"
                  style={{ position: "absolute", right: 25, cursor: "pointer", zIndex: 10000 }}
                />
              </>
            )}

            {/* Iframe con zoom */}
            <iframe
              width={`${zoom * 100}%`}
              height={`${zoom * 100}%`}
              allowFullScreen
              style={{
                border: "none",
                borderRadius: "8px",
                maxWidth: "90%",
                maxHeight: "85%",
                transform: `scale(${zoom})`,
                transition: "transform 0.3s ease",
              }}
              src={`https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${encodeURIComponent(
                tours[fullscreenIndex].imagen
              )}`}
              title={tours[fullscreenIndex].titulo || `Tour ${fullscreenIndex + 1}`}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
