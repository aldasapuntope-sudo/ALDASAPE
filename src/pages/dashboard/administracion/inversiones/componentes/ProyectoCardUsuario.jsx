// src/.../ProyectoCardUsuario.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaEdit, FaLock } from "react-icons/fa";
import config from "../../../../../config";
import { FaMapMarkerAlt, FaTag } from "react-icons/fa";

export default function ProyectoCardUsuario({ proyecto, activo, onEditar, esAdmin }) {
  
  console.log(proyecto);
  const crearSlug = (texto) => {
    return texto
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const imagen = proyecto.imagen_principal
    ? `${config.urlserver}${proyecto.imagen_principal}`
    : "https://via.placeholder.com/400x250";

  const irDetalle = () => {
    if (activo) {
      const slug = crearSlug(proyecto.titulo);
      window.location.href = `/proyecto/${proyecto.id}-${slug}`;
    }
  };

  return (
    <Card
      className={`shadow-sm border-0 rounded-4 position-relative ${
        !activo ? "opacity-50" : ""
      }`}
      style={{ cursor: activo ? "pointer" : "not-allowed" }}
      onClick={irDetalle}
    >
      {/* BOTÓN EDITAR SOLO PARA ADMIN */}
      {esAdmin && (
        <Button
          variant=""
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle boton-editar-card btn btn-outline-success btn-sm"
          onClick={(e) => {
            e.stopPropagation(); // NO abrir detalle
            onEditar(proyecto);
          }}
        >
          <FaEdit />
        </Button>
      )}

      {/* LOCK si NO activo */}
      {!activo && (
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <FaLock size={50} className="text-dark opacity-75" />
        </div>
      )}

      <img
        src={imagen}
        alt={proyecto.titulo}
        style={{ height: "220px", objectFit: "cover" }}
        className="w-100"
      />

      <Card.Body>
        <h5>{proyecto.titulo}</h5>
        <p className="text-muted mb-2">{proyecto.descripcion}</p>

        {/* DIVISIÓN UBICACIÓN / CATEGORÍA */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          
          {/* UBICACIÓN */}
          <div className="d-flex align-items-center text-muted" style={{ fontSize: "0.9rem" }}>
            <FaMapMarkerAlt className="me-1 text-danger" />
            <span
              style={{
                maxWidth: "200px",
                whiteSpace: "normal",
                wordBreak: "break-word",
                lineHeight: "1.2",
                textAlign: "justify"
              }}
            >
              {proyecto.ubicacion}
            </span>
          </div>

          {/* CATEGORÍA */}
          <div className="d-flex align-items-center text-muted" style={{ fontSize: "0.9rem" }}>
            <FaTag className="me-1 text-success" />
            <span>
              {proyecto.categoria ?? "General"}
            </span>
          </div>

        </div>

        {activo && <p className="text-success fw-bold mb-0">Disponible para ti</p>}
      </Card.Body>
    </Card>
  );
}
