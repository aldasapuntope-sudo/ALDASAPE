import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../css/PropertyCard.css";
import { Card } from "react-bootstrap";
import config from "../config";
import { useNavigate } from "react-router-dom";

export default function PropertyCard({ anuncio }) {
  const navigate = useNavigate();

  const imagen = anuncio.imagen
    ? `${config.urlserver}${anuncio.imagen}`
    : "https://aldasa.pe/wp-content/themes/theme_aldasape/img/comprar-inmueble.jpg";


  // 🔹 Función para crear slug (nombre amigable)
  const crearSlug = (texto) => {
    return texto
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // reemplaza todo lo que no sea letra o número por guiones
      .replace(/^-+|-+$/g, ""); // elimina guiones del inicio y fin
  };

  const handleClick = () => {
    const slugTitulo = crearSlug(anuncio.titulo);
    const slugUbicacion = crearSlug(anuncio.ubicacion);
    // Redirige a /anuncio/23-titulo-ubicacion
    navigate(`/anuncio/${anuncio.id}-${slugTitulo}-${slugUbicacion}`);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  };


  return (
   <Card
      className="property-box2 shadow-sm border-0 rounded-2 overflow-hidden h-100 property-card-hover"
      style={{ cursor: "pointer" }}
      onClick={() => {
        handleClick();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <div className="position-relative">
        <img
          src={imagen}
          alt={anuncio.titulo}
          className="w-100"
          style={{ height: "230px", objectFit: "cover" }}
        />

        <div className="item-category-box1">
          <div className="item-category">{anuncio.operacion}</div>
        </div>

        <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-75 text-white px-3 py-2 rounded-end">
          <strong>{anuncio.simbolo} {formatearPrecio(anuncio.precio)}</strong>
        </div>
      </div>

      <div className="item-category10 mt-2">
        <a href="#" className="text-success fw-semibold">
          {anuncio.tipo?.toUpperCase()}
        </a>
      </div>

      <Card.Body className="p-3">
        <h5
          className="mb-1 text-truncate"
          style={{ textAlign: "justify", width: "294px" }}
        >
          {anuncio.titulo}
        </h5>
        <div className="text-muted small mb-2 d-flex align-items-center">
          <FaMapMarkerAlt className="text-success me-2" />
          {anuncio.direccion
            ? `${anuncio.direccion} - ${anuncio.ubicacion}`
            : anuncio.ubicacion}
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
                  onError={(e) => (e.target.style.display = "none")}
                />
                {carac.valor} {carac.unidad ? ` ${carac.unidad}` : ""}{" "}
                {carac.nombre}
              </li>
            ))}
        </ul>

        <div className="d-flex flex-wrap gap-2 mt-2" style={{ float: "right" }}>
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
                    src={amenity.icon_url}
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
