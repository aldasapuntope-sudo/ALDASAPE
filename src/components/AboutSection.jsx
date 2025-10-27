import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaCheck } from "react-icons/fa";
import axios from "axios";
import "../css/AboutSection.css";

export default function AboutSection() {
  const [showVideo, setShowVideo] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/paginaprincipal/quienes-somos");
        setData(res.data[0]); // tomamos el primer registro
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="about-section text-center py-5">
        <p className="text-muted fw-semibold">Cargando información...</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="about-section text-center py-5">
        <p className="text-danger fw-semibold">No se encontró la información.</p>
      </section>
    );
  }

  return (
    <section className="about-section relative overflow-hidden py-5">
      {/* Imagen decorativa */}
      <img
        src="/assets/images/video-bg-2.svg"
        alt="shape"
        className="position-absolute top-0 start-0 opacity-25"
        style={{ width: "400px", zIndex: "-1" }}
      />

      <div className="container">
        <div className="row align-items-center">
          {/* Imagen y botón Play */}
          <div className="col-lg-6 mb-5 mb-lg-0 position-relative text-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="position-relative d-inline-block">
                <div className="item-img1">
                  <img
                    src={data.imagen_destacada || "/assets/images/placeholder.webp"}
                    alt={data.titulo}
                    className="img-fluid rounded-4 shadow-lg"
                  />
                </div>

                {/* Botón Play con efecto latido */}
                <motion.button
                  className="play-btn-modern"
                  onClick={() => setShowVideo(true)}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaPlay size={28} color="#fff" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Texto dinámico */}
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span
                className="section-subtitle text-success fw-semibold d-block mb-2"
                style={{
                  position: "relative",
                  paddingLeft: "25px",
                  display: "inline-block",
                  backgroundImage: "url('/assets/images/favicon-aldasape.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "23px 23px",
                  backgroundPosition: "0 50%",
                }}
              >
                Te acompañamos en cada paso
              </span>

              <h2 className="section-title fw-bold mb-3">{data.titulo}</h2>

              {/* El contenido HTML se renderiza directamente */}
              <div
                className="text-muted mb-4"
                dangerouslySetInnerHTML={{ __html: data.contenido }}
              />

            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal del video */}
      {showVideo && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <motion.div
            className="video-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              width="800"
              height="450"
              src="https://www.youtube.com/embed/eUEoyMpZV5o?autoplay=1"
              title="Video ALDASA"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      )}
    </section>
  );
}
