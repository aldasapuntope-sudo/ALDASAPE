import React, { useState } from "react";
import { FaTimes, FaPlay } from "react-icons/fa";
import config from "../../../config";

export default function ProyectoMultimedia({ multimedia }) {
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);

  if (!multimedia || multimedia.length === 0) return null;

  // 🎥 Filtrar solo videos
  const videos = multimedia.filter((item) => item.tipo === "video");

  if (videos.length === 0) return null;

  // 🔁 Convertir URL YouTube a embed
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
    }
    return url;
  };

  // 🧩 Extraer ID de YouTube (miniatura)
  const extraerIdYoutube = (url) => {
    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  };

  return (
    <>
      <div className="card shadow-sm border-0 rounded-4 p-4 mt-4">
        <h3 className="mb-3">Videos del Proyecto</h3>

        <div className="row">
          {videos.map((video) => {
            const esYoutube =
              video.archivo.includes("youtube.com") ||
              video.archivo.includes("youtu.be");

            return (
              <div className="col-12 mb-4" key={video.id}>
                <div className="position-relative">
                  {/* 🖼 Miniatura */}
                  <img
                    src={
                      esYoutube
                        ? `https://img.youtube.com/vi/${extraerIdYoutube(
                            video.archivo
                          )}/hqdefault.jpg`
                        : "/img/video-thumb.jpg"
                    }
                    alt="Video del proyecto"
                    className="img-fluid rounded shadow-sm"
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setVideoSeleccionado(video)}
                  />

                  {/* ▶ Botón Play */}
                  <div
                    onClick={() => setVideoSeleccionado(video)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="d-flex justify-content-center align-items-center bg-white rounded-circle"
                      style={{
                        width: "70px",
                        height: "70px",
                        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                      }}
                    >
                      <FaPlay size={28} color="#dc3545" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🎬 MODAL FULLSCREEN */}
      {videoSeleccionado && (
        <div
          className="fullscreen-video"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          {/* ❌ Cerrar */}
          <FaTimes
            size={30}
            color="#fff"
            onClick={() => setVideoSeleccionado(null)}
            style={{
              position: "absolute",
              top: 25,
              right: 30,
              cursor: "pointer",
              zIndex: 10000,
            }}
          />

          {/* ▶ Render del video */}
          {videoSeleccionado.archivo.includes("youtube") ||
          videoSeleccionado.archivo.includes("youtu.be") ? (
            <iframe
              src={getYouTubeEmbedUrl(videoSeleccionado.archivo)}
              title="Video del proyecto"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                width: "90%",
                height: "90%",
                borderRadius: "6px",
              }}
            ></iframe>
          ) : (
            <video
              src={
                videoSeleccionado.archivo.startsWith("http")
                  ? videoSeleccionado.archivo
                  : `${config.urlserver}videosproyecto/${videoSeleccionado.archivo}`
              }
              controls
              autoPlay
              style={{
                width: "90%",
                height: "90%",
                background: "#000",
              }}
            ></video>
          )}
        </div>
      )}
    </>
  );
}
