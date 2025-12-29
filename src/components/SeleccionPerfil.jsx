import React from "react";
import "../css/SeleccionPerfil.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaHandshake, FaBuilding } from "react-icons/fa";

export default function SeleccionPerfil() {
  const navigate = useNavigate();

  const perfiles = [
    {
      titulo: "Particular",
      subtitulo: "Dueño Directo",
      icono: <FaUser size={40} />,
      ruta: "/particular",
    },
    {
      titulo: "Inmobiliaria",
      subtitulo: "Corredor",
      icono: <FaHandshake size={40} />,
      ruta: "/registro/inmobiliaria",
    },
    {
      titulo: "Constructora",
      subtitulo: "Desarrolladora",
      icono: <FaBuilding size={40} />,
      ruta: "/registro/constructora",
    },
  ];

  return (
    <div className="perfil-page">
    

      {/* CONTENIDO */}
      <main className="perfil-content">
        <h1>¿Con qué perfil te identificas?</h1>
        <p>Selecciona el que se ajusta a tus intereses.</p>

        <div className="perfil-cards">
          {perfiles.map((perfil, index) => (
            <div
              key={index}
              className="perfil-card"
              onClick={() => navigate(perfil.ruta)}
            >
              <div className="perfil-card-top" />
              <div className="perfil-icon">{perfil.icono}</div>
              <h3>{perfil.titulo}</h3>
              <span>{perfil.subtitulo}</span>
            </div>
          ))}
        </div>
      </main>

    
    </div>
  );
}
