import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

export default function ProyectoEtapas({ etapas = [] }) {
  if (!etapas.length)
    return <p className="text-muted">No hay etapas registradas.</p>;

  return (
    <div className="mt-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h3 className="item-title mb-3">Novedades del Proyecto</h3>

          <ul className="list-group list-group-flush">
            {etapas.map((e) => (
              <li
                key={e.id}
                className={`list-group-item d-flex justify-content-between align-items-center 
                  ${e.completado ? "list-group-item-success" : ""} border-0 px-0 py-2`}
              >
                <span>
                  <strong>{e.orden}. </strong> {e.nombre}
                </span>

                <span className="d-flex align-items-center gap-2">
                  {e.completado ? (
                    <>
                      <FaCheckCircle className="text-success" size={18} />
                      <span className="badge bg-success text-white rounded-pill">
                        Completo
                      </span>
                    </>
                  ) : (
                    <>
                      <FiClock className="text-secondary" size={18} />
                      <span className="badge bg-secondary text-white rounded-pill">
                        Pendiente
                      </span>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
