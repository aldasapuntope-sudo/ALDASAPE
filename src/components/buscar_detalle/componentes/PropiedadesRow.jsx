import React, { useState, useMemo } from "react";
import { FaTh, FaListUl } from "react-icons/fa";
import PropiedadesTabs from "./PropiedadesTabs";

export default function PropiedadesRow({ resultados }) {
  const [orden, setOrden] = useState("default");
  const [vista, setVista] = useState("lista"); // 👈 controla vista activa

  // 🔄 Orden dinámico
  const resultadosOrdenados = useMemo(() => {
    if (!resultados?.length) return [];
    let copia = [...resultados];

    switch (orden) {
      case "precio-alto":
        return copia.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
      case "precio-bajo":
        return copia.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
      case "nuevos":
        return copia.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "antiguos":
        return copia.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      default:
        return copia;
    }
  }, [resultados, orden]);

  if (!resultados?.length) return null;

  return (
    <>
      <div className="row justify-content-center mb-3">
        <div className="col-lg-12 col-md-12">
          <div className="item-shorting-box">
            <div className="shorting-title">
              <h4 className="item-title">
                Mostrando 1–{resultadosOrdenados.length} resultados
              </h4>
            </div>

            <div className="item-shorting-box-2 d-flex justify-content-between align-items-center">
              {/* 🔽 Ordenar */}
              <div className="by-shorting d-flex align-items-center gap-2">
                <div className="shorting">Ordenar por:</div>
                <select
                  className="select single-select mr-0"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                >
                  <option value="default">Predeterminado</option>
                  <option value="precio-alto">Precio más alto</option>
                  <option value="precio-bajo">Precio más bajo</option>
                  <option value="nuevos">Más recientes</option>
                  <option value="antiguos">Más antiguos</option>
                </select>
              </div>

              {/* 🔳 Botones de vista */}
              <div className="grid-button">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#mylisting">
                      <FaTh /> {/* ✅ ícono de cuadrícula */}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#reviews"
                    >
                      <FaListUl /> {/* ✅ ícono de lista */}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔽 Renderizado de tabs */}
      <PropiedadesTabs resultados={resultadosOrdenados} vista={vista} />
    </>
  );
}
