import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import config from "../../../config";

export default function Amenities({ anuncio }) {
  const amenities = anuncio?.amenities || [];

  // Agrupar amenities en filas de 3 columnas
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const amenityRows = chunkArray(amenities, 3); // 3 columnas por fila

  return (
    <div className="overview-area ameniting-box mt-1">
      <h3 className="item-title mb-3">Características y comodidades</h3>

      {amenities.length > 0 ? (
        amenityRows.map((row, rowIndex) => (
          <div className="row mb-3" key={rowIndex}>
            {row.map((carac, colIndex) => (
              <div className="col-lg-4 col-md-6 mb-2" key={colIndex}>
                <div className="d-flex align-items-center">
                  {carac.icono ? (
                    <img
                      src={`${config.urlserver}iconos/${carac.icono}`}
                      alt={carac.nombre}
                      width="20"
                      height="20"
                      style={{ marginRight: "8px" }}
                    />
                  ) : (
                    <FaCheckCircle
                      style={{
                        color: "var(--green)",
                        marginRight: "8px",
                        verticalAlign: "middle",
                        fontSize: "18px",
                      }}
                    />
                  )}
                  <span>{carac.nombre}</span>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No hay características secundarias registradas.</p>
      )}
    </div>
  );
}
