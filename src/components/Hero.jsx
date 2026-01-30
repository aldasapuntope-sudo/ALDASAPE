import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchFilter from "./SearchFilter";
import config from "../config";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePublicData } from "../context/PublicDataContext";

export default function Hero() {
  const { sliders, loading } = usePublicData();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const [mode, setMode] = useState("alquiler");

  // 🔁 Slider automático (SIEMPRE se declara)
  useEffect(() => {
    if (loading || paused || !sliders || sliders.length === 0) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % sliders.length);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [paused, sliders, loading]);

  const nextSlide = () => {
    if (!sliders || sliders.length === 0) return;
    setIndex((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    if (!sliders || sliders.length === 0) return;
    setIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  // ⛔ Render controlado (AQUÍ sí se puede)
  if (loading || !sliders || sliders.length === 0) return null;

  return (
    <section
      className="hero-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ⬅️ Botón izquierda */}
      <button className="slider-btn left" onClick={prevSlide}>
        <FaChevronLeft />
      </button>

      {/* ➡️ Botón derecha */}
      <button className="slider-btn right" onClick={nextSlide}>
        <FaChevronRight />
      </button>

      {/* 🎞️ Fondo animado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sliders[index].id}
          className="hero-bg"
          style={{
            backgroundImage: `url(${config.urlserver}${sliders[index].imagen_url})`,
          }}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>
          {sliders[index]?.titulo
            ? sliders[index].titulo.charAt(0).toUpperCase() +
              sliders[index].titulo.slice(1)
            : "Encuentra tu próximo lugar"}
        </h1>

        <p style={{ textAlign: "center" }}>
          {sliders[index]?.descripcion ||
            "Explora miles de inmuebles para comprar, alquilar o invertir"}
        </p>

        <div className="search-box-wrapper">
          <SearchFilter mode={mode} setMode={setMode} />
        </div>
      </div>
    </section>
  );
}
