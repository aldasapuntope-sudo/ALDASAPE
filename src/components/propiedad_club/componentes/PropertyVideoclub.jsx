import React, { useState } from "react";
import { FaTimes, FaPlay } from "react-icons/fa";
import config from "../../../config";

export default function PropertyVideoclub({ anuncio }) {
  const [fullscreenVideo, setFullscreenVideo] = useState(null);

  // 🟡 Si no hay videos
  if (!anuncio?.videos?.length) {
    return (
      <div></div>
      /*<div className="overview-area video-box1 mt-1">
        <h3 className="item-title">Video del Inmueble</h3>
        <div className="alert alert-warning text-center" role="alert">
          No hay videos disponibles para este anuncio.
        </div>
      </div>*/
    );
  }

  const openFullscreen = (video) => setFullscreenVideo(video);
  const closeFullscreen = () => setFullscreenVideo(null);

  // 🧩 Función para transformar URLs de YouTube
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
    } else {
      return url;
    }
  };

  return (
    <div className="overview-area video-box1 mt-1">
      <h3 className="item-title">Videos de {anuncio.tipo_propiedad}</h3>

      <div className="row">
        {anuncio.videos.map((video, index) => (
          <div className="col-md-12 mb-3" key={index}>
            <div className="item-img position-relative">
              {/* Miniatura */}
              <img
                src={
                  video.tipo === "youtube"
                    ? `https://img.youtube.com/vi/${extraerIdYoutube(video.url)}/hqdefault.jpg`
                    : video.thumbnail
                    ? video.thumbnail
                    : "/img/blog/listing1.jpg"
                }
                alt={video.titulo}
                className="img-fluid rounded shadow-sm"
                style={{
                  width: "100%",
                  height: "350px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => openFullscreen(video)}
              />

              {/* Botón de reproducir centrado */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: 2,
                }}
                onClick={() => openFullscreen(video)}
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
        ))}
      </div>

      {/* 🎥 Pantalla completa */}
      {fullscreenVideo && (
        <div
          className="fullscreen-video"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.97)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          {/* Botón cerrar */}
          <FaTimes
            onClick={closeFullscreen}
            size={30}
            color="#fff"
            style={{
              position: "absolute",
              top: 25,
              right: 30,
              cursor: "pointer",
              zIndex: 10000,
            }}
            title="Cerrar"
          />

          {/* Renderizado del video */}
          {fullscreenVideo.tipo === "youtube" ? (
            <iframe
              src={getYouTubeEmbedUrl(fullscreenVideo.url)}
              title={fullscreenVideo.titulo}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                width: "90%",
                height: "90%",
                borderRadius: '5px'
              }}
            ></iframe>
          ) : (
            <video
              src={
                fullscreenVideo.url.startsWith("http")
                  ? fullscreenVideo.url
                  : `${config.urlserver}videospropiedad/${fullscreenVideo.url}`
              }
              controls
              autoPlay
              style={{
                width: "100%",
                height: "100%",
                background: "#000",
              }}
            ></video>
          )}
        </div>
      )}
    </div>
  );
}

// 🧩 Función auxiliar para extraer ID de YouTube
function extraerIdYoutube(url) {
  const regExp =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}
