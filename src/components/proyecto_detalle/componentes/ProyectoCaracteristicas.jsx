import React from "react";

export default function ProyectoCaracteristicas({ caracteristicas }) {
  if (!caracteristicas || caracteristicas.length === 0) return null;

  return (
    <div className="overview-area listing-area mt-4">
      <h3 className="item-title mb-3">Características del proyecto</h3>

      <ul className="list-group">
        {caracteristicas.map((item) => (
          <li key={item.id} className="list-group-item">
            <strong>{item.titulo}:</strong>{" "}
            <span>{item.descripcion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
