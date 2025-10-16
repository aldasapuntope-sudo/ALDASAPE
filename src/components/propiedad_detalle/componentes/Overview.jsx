import React from "react";
import { FaHome } from "react-icons/fa";
import config from "../../../config";

export default function Overview({ anuncio }) {
  console.log(anuncio);

  // URL base para los íconos
 

  return (
    <div className="overview-area mt-4">
      <h3 className="item-title mb-3">Características Principales</h3>

      {anuncio?.caracteristicas?.length > 0 ? (
        <div className="gallery-icon-box mt-3">
          {anuncio.caracteristicas.map((carac, index) => (
            <div className="item-icon-box" key={index}>
              <div className="item-icon">
                {carac.icono ? (
                  <img
                    src={`${config.urlserver}iconos/${carac.icono}`}
                    alt={carac.nombre}
                    width="20"
                    height="20"
                  />
                ) : (
                  <FaHome />
                )}
              </div>
              <ul className="item-number">
                <li>{carac.nombre}:</li>
                <li className="deep-clr">
                  {carac.valor || carac.unidad || "Sí"}
                </li>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay características registradas.</p>
      )}
    </div>
  );
}
