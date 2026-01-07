import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchFilter from './SearchFilter';
import config from '../config';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const [mode, setMode] = useState('alquiler');
  // Obtener imágenes desde la API
  useEffect(() => {
    const cargarSlides = async () => {
      const res = await axios.get(`${config.apiUrl}api/paginaprincipal/sliders`);
      setSlides(res.data);
    };
    cargarSlides();
  }, []);

  // Slider automático
  useEffect(() => {
    if (slides.length === 0) return;

    if (!paused) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => clearInterval(intervalRef.current);
  }, [slides, paused]);

  const nextSlide = () => {
    setIndex(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;
console.log(slides);
  return (
    <section
      className="hero-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* Botón izquierda */}
      <button className="slider-btn left" onClick={prevSlide}>
        <FaChevronLeft />
      </button>

      {/* Botón derecha */}
      <button className="slider-btn right" onClick={nextSlide}>
        <FaChevronRight />
      </button>

      {/* Fondo animado tipo slider con slide LEFT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          className="hero-bg"
          style={{
            backgroundImage: `url(${config.urlserver}${slides[index].imagen_url})`
          }}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.0, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>
          {slides[index]?.titulo
            ? slides[index].titulo.charAt(0).toUpperCase() +
              slides[index].titulo.slice(1)
            : "Encuentra tu próximo lugar"}
        </h1>

        <p style={{ textAlign: "center" }}>
          {slides[index]?.descripcion ||
            "Explora miles de inmuebles para comprar, alquilar o invertir"}
        </p>

        <div className="search-box-wrapper">
          <SearchFilter mode={mode} setMode={setMode} />
        </div>
      </div>

    </section>
  );
}
