import React from "react";

export default function ProyectoCaracteristicas({ caracteristicas }) {
  if (!caracteristicas || caracteristicas.length === 0) return null;

  return (
    <div className="single-listing-box1 mt-4">
      <h4>Características</h4>

      <ul className="mt-3">
        {caracteristicas.map((item) => (
          <li key={item.id}>
            <strong>{item.titulo}: </strong>
            {item.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}
