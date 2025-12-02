import React from "react";

export default function ProyectoCaracteristicas({ caracteristicas }) {
  if (!caracteristicas || caracteristicas.length === 0) return null;

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4">
      <h3 className="item-title mb-3">Características del proyecto</h3>

      <ul className="list-group list-group-flush">
        {caracteristicas.map((item) => (
          <li key={item.id} className="list-group-item border-0 px-0 py-2">
            <strong>{item.titulo}:</strong>{" "}
            <span>{item.descripcion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
