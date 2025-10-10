import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchFilter from './SearchFilter';

const backgrounds = {
  alquilar: '/assets/images/bg-buscador.webp',
  comprar: '/assets/images/hero-comprar.jpg',
  proyectos: '/assets/images/hero-proyectos.jpg'
}

export default function Hero(){
  const [mode, setMode] = useState('alquilar'); // por defecto alquilar

  return (
    <section className="hero-section">
      {/* Background / animated crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={mode}
          className="hero-bg"
          style={{ backgroundImage:`url(${backgrounds[mode]})` }}
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.7 }}
        />
      </AnimatePresence>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>Encuentra tu próximo lugar</h1>
        <p style={{textAlign:'center'}}>Explora miles de inmuebles para comprar, alquilar o invertir</p>

        <div className="search-box-wrapper">
          <SearchFilter mode={mode} setMode={setMode} />
        </div>
      </div>
    </section>
  )
}
