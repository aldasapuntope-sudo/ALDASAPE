import React from "react";
import config from "../../../config";
import MapLocationproyecto from "./MapLocationproyecto";


export default function ProyectoHeading({ proyecto }) {
  const img = `${config.urlserver}${proyecto.imagen_principal}`;

  const totalEtapas = proyecto.etapas?.length || 0;
  const completadas =
    proyecto.etapas?.filter((e) => e.completado === 1 || e.completado === true)
      .length || 0;
  const avance =
    totalEtapas > 0 ? Math.round((completadas / totalEtapas) * 100) : 0;

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
      <div className="item-heading-left mb-3">
        <h3 className="mb-3">{proyecto.titulo}</h3>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li className="mb-2">
            <strong>Ubicación:</strong> {proyecto.ubicacion}
          </li>

          <li className="mt-2 mb-3">
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
                  transition: "width 0.8s ease",
                }}
              />
            </div>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "13px",
                display: "block",
                marginTop: "5px",
              }}
            >
              {avance}% ({completadas} / {totalEtapas} etapas)
            </span>
          </li>

          <li className="mt-2">
            <strong>Inversionistas:</strong> {proyecto.inversionistas?.length || 0}
          </li>
        </ul>
      </div>

      {/* Componente de mapa */}
      <MapLocationproyecto direccion={proyecto.ubicacion} />
    </div>
  );
}
