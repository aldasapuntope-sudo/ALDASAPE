import React from "react";
import config from "../../../config";

export default function ProyectoHeading({ proyecto }) {
  const img = `${config.urlserver}${proyecto.imagen_principal}`;

  const avance = Number(proyecto.porcentaje_avance) || 0;

  return (
    <div className="single-listing-box1">

      {/* Título */}
      <div className="item-heading-left mb-3">
        <h3>{proyecto.titulo}</h3>

        <div className="pd-meta">
          <ul>
            <li>
              <strong>Ubicación:</strong> {proyecto.ubicacion}
            </li>

            {/* 🔵 Barra de progreso del Avance */}
            <li className="mt-2">
              <strong>Avance del proyecto:</strong>
              <div
                style={{
                  width: "100%",
                  background: "#e9ecef",
                  borderRadius: "8px",
                  height: "10px",
                  marginTop: "6px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${avance}%`,
                    height: "100%",
                    background: "#28a745",
                    transition: "width 1s ease",
                  }}
                />
              </div>
              <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                {avance}%
              </span>
            </li>

            {/* Inversionistas */}
            <li>
              <strong>Inversionistas:</strong>{" "}
              {proyecto.inversionistas?.length || 0}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
