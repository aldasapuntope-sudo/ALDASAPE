import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaArrowsAltH,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaEye
} from "react-icons/fa";
import { Card } from "react-bootstrap";
import config from "../../../../config";

export default function AnuncioCard({ anuncio }) {

 
  const imagen = anuncio.imagen
  ? `${config.urlserver}${anuncio.imagen}`
  : "https://aldasa.pe/wp-content/themes/theme_aldasape/img/comprar-inmueble.jpg";


  
  return (
    <Card className="property-box2 shadow-sm border-0 rounded-4 overflow-hidden h-100">
      {/* Imagen */}
      <div className="position-relative">
        <img
          src={imagen}
          alt={anuncio.titulo}
          className="w-100"
          style={{ height: "230px", objectFit: "cover" }}
        />

        {/* Tipo de operación */}
        <div className="position-absolute top-0 start-0 m-2">
          <span className="bg-success text-light px-2 py-1 rounded text-uppercase small">
            {anuncio.operacion}
          </span>
        </div>

        {/* Precio */}
        <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-75 text-white px-3 py-2 rounded-end">
          <strong>S/ {anuncio.precio}</strong>
        </div>

        {/* Íconos */}
        <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
        {anuncio.isPublish === 1 ? (
            <span
            className="bg-success text-light px-2 py-1 rounded text-uppercase small d-flex align-items-center"
            >
            <FaEye className="me-1" /> En circulación
            </span>
        ) : (
            <span
            className="bg-warning text-dark px-2 py-1 rounded text-uppercase small d-flex align-items-center"
            >
            <FaEye className="me-1" /> En revisión
            </span>
        )}
        </div>

      </div>

      {/* Contenido */}
      <div class="item-category10 mt-2"><a href="single-listing1.html" class="text-success fw-semibold">{anuncio.tipo?.toUpperCase()}</a></div>
      <Card.Body className="p-3">
        {/*text-truncate */}
        <h5 className="mb-1" style={{textAlign: 'justify', width: '294px'}}>{anuncio.titulo}</h5>
        <div className="text-muted small mb-2 d-flex align-items-center">
          <FaMapMarkerAlt className="text-success me-2" />
          {anuncio.direccion ? `${anuncio.direccion} - ${anuncio.ubicacion}` : anuncio.ubicacion}
        </div>

        <ul className="list-inline mb-0 small text-secondary">
          {anuncio.caracteristicas?.length > 0 &&
            anuncio.caracteristicas.map((carac, index) => (
              <li key={index} className="list-inline-item me-3">
                <img
                  src={`${config.urlserver}iconos/${carac.icono}`}
                  alt={carac.nombre}
                  width="20"
                  height="20"
                  className="me-1 align-text-bottom"
                  onError={(e) => (e.target.style.display = "none")} // oculta si no carga
                />
                {carac.valor} {carac.unidad ? ` ${carac.unidad}` : ""} {carac.nombre}
                
              </li>
            ))}
        </ul>
        

        {/* Características secundarias / amenities */}
        <div className="d-flex flex-wrap gap-2 mt-2" style={{float:'right'}}>
          {anuncio.caracteristicas_secundarios?.length > 0 &&
            anuncio.caracteristicas_secundarios.map((amenity, index) => (
              <div
                key={index}
                className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                style={{
                  backgroundColor: "var(--green)",
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: "500",
                }}
              >
                {/*amenity.icon_url && (
                  <img
                    src={`${config.urlserver}iconos/${amenity.icon_url}`}
                   // src={amenity.icon_url}
                    alt={amenity.nombre}
                    width="18"
                    height="18"
                    style={{ filter: "invert(1)", opacity: 0.9 }}
                  />
                )*/}
                <span>{amenity.nombre}</span>
              </div>
            ))}
        </div>
      </Card.Body>
    </Card>
  );
}
