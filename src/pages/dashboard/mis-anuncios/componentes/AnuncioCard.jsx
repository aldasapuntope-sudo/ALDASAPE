import React from "react";
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
    console.log(anuncio);
  const imagen = anuncio.imagen
    ? anuncio.imagen
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
      <Card.Body className="p-3">
        {/*text-truncate */}
        <h5 className="mb-1" style={{textAlign: 'justify', width: '294px'}}>{anuncio.titulo}</h5>
        <div className="text-muted small mb-2 d-flex align-items-center">
          <FaMapMarkerAlt className="text-success me-2" />
          {anuncio.ubicacion}
        </div>

        <ul className="list-inline mb-0 small text-secondary">
          <li className="list-inline-item me-3">
            <FaBed className="text-success me-1" />
            {anuncio.dormitorios} Dorms
          </li>
          <li className="list-inline-item me-3">
            <FaBath className="text-success me-1" />
            {anuncio.banos} Baños
          </li>
          <li className="list-inline-item">
            <FaRulerCombined className="text-success me-1" />
            {anuncio.area} m²
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
}
