import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import config from "../../../config";

export default function Amenities({ anuncio }) {
  console.log(anuncio);

  return (
    <div className="overview-area ameniting-box mt-1">
      <h3 className="item-title mb-3">Características y comodidades</h3>

      {anuncio?.amenities?.length > 0 ? (
        <div className="row">
          {Array.from({ length: 3 }).map((_, colIndex) => (
            <div className="col-lg-4" key={colIndex}>
              <ul className="ameniting-list">
                {anuncio.amenities
                  .slice(colIndex * 4, colIndex * 4 + 4)
                  .map((carac, index) => (
                    <li key={index}>
                      {carac.icono ? (
                        // Si usas tus íconos personalizados desde el servidor
                        <img
                          src={`${config.urlserver}iconos/${carac.icono}`}
                          alt={carac.nombre}
                          width="18"
                          height="18"
                          style={{ marginRight: "8px" }}
                        />
                      ) : (
                        // Ícono por defecto si no hay icono personalizado
                        <FaCheckCircle
                          style={{
                            color: "var(--green)",
                            marginRight: "8px",
                            verticalAlign: "middle",
                            fontSize: '20px',
                          }}
                        />
                      )}
                      {carac.nombre}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay características secundarias registradas.</p>
      )}
    </div>
  );
}
