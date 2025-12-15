import React from "react";
import { FaHome } from "react-icons/fa";
import config from "../../../config";

export default function Overviewclub({ anuncio }) {
  // Si no hay características, usa un arreglo vacío
  const caracteristicas = anuncio?.caracteristicas || [];

  // Agrupar las características en filas de 3
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const filas = chunkArray(caracteristicas, 3);

  return (
    <div className="overview-area mt-4">
      <h3 className="item-title mb-3">Características Principales</h3>

      {caracteristicas.length > 0 ? (
        <div className="gallery-icon-box mt-3 mb-3">
          {filas.map((fila, filaIndex) => (
            <div className="row" style={{display: 'contents'}} key={filaIndex}>
              {fila.map((carac, index) => (
                <div className="col-6 col-md-4 mb-3" key={index}>
                  <div className="item-icon-box d-flex align-items-center">
                    <div className="item-icon" style={{ marginRight: "8px" }}>
                      {carac.icono ? (
                        <img
                          src={`${config.urlserver}iconos/${carac.icono}`}
                          alt={carac.nombre}
                          width="20"
                          height="20"
                        />
                      ) : (
                        <FaHome
                          style={{
                            color: "var(--green)",
                            fontSize: "18px",
                          }}
                        />
                      )}
                    </div>

                    <ul className="item-number mb-0">
                      <li className="fw-semibold text-dark">{carac.nombre}:</li>
                      <li className="deep-clr">
                        {carac.valor || carac.unidad || "Sí"}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay características registradas.</p>
      )}
    </div>
  );
}
