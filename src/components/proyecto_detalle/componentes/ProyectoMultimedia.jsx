import React, { useState } from "react";
import config from "../../../config";

export default function ProyectoMultimedia({ multimedia }) {
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);

  if (!multimedia || multimedia.length === 0) return null;

  // Filtrar solo videos
  const videos = multimedia.filter((item) => item.tipo === "video");

  if (videos.length === 0) return null;

  return (
    <>
      <div className="card shadow-sm border-0 rounded-4 p-4 mt-4">
        <h3 className="mb-3">Videos del Proyecto</h3>

        <div className="row">
          {videos.map((video) => (
            <div key={video.id} className="col-12 mb-4">
              <div
                className="card shadow-sm border-0 rounded-4 overflow-hidden"
                style={{ cursor: "pointer" }}
                onClick={() => setVideoSeleccionado(video.archivo)}
              >
                <div className="ratio ratio-16x9">
                  <iframe
                    src={video.archivo}
                    title="Video del proyecto"
                    allowFullScreen
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      pointerEvents: "none", // Evita que el iframe capture el click
                    }}
                  ></iframe>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FULLSCREEN */}
      {videoSeleccionado && (
        <div
          className="video-modal"
          onClick={() => setVideoSeleccionado(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "900px",
              aspectRatio: "16/9",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <iframe
              src={videoSeleccionado}
              title="Video en pantalla completa"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none" }}
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
