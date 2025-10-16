import React from "react";
import { FaMapMarkerAlt, FaShareAlt, FaHeart, FaArrowsAltH, FaPrint } from "react-icons/fa";

export default function PropertyHeading({ anuncio }) {
  return (
    <div className="property-heading">
      {/* 🏷️ Operación y precio */}
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="single-list-cate">
            <div className="item-categoery text-uppercase fw-semibold text-success">
              {anuncio?.operaciones ? anuncio.operaciones.toUpperCase() : "SIN OPERACIÓN"}
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="single-list-price text-end fs-4 text-primary fw-bold">
            S/ {anuncio?.precio || "0.00"}
          </div>
        </div>
      </div>

      {/* 🏠 Título y dirección */}
      <div className="row align-items-center mt-3">
        <div className="col-lg-8 col-md-12">
          <div className="single-verified-area">
            <div className="item-title">
              <h3 className="fw-bold text-dark mb-2">
                {anuncio?.titulo || "Propiedad sin título"}
              </h3>
            </div>
          </div>
          <div className="single-item-address text-muted">
            <ul className="list-unstyled mb-0">
              <li>
                <FaMapMarkerAlt className="me-2 text-success" />
                {anuncio?.direccion
                  ? `${anuncio.direccion} - ${anuncio.ubicacion}`
                  : anuncio?.ubicacion || "Ubicación no disponible"}
              </li>
            </ul>
          </div>
        </div>

        {/* 🔘 Botones de acción */}
        <div className="col-lg-4 col-md-12">
          <div className="side-button text-end">
            <ul className="list-inline mb-0 d-flex justify-content-end gap-2">
              <li className="list-inline-item">
                <button className="btn btn-outline-success btn-sm rounded-circle">
                  <FaShareAlt />
                </button>
              </li>
              <li className="list-inline-item">
                <button className="btn btn-outline-danger btn-sm rounded-circle">
                  <FaHeart />
                </button>
              </li>
              <li className="list-inline-item">
                <button className="btn btn-outline-secondary btn-sm rounded-circle">
                  <FaArrowsAltH />
                </button>
              </li>
              <li className="list-inline-item">
                <button className="btn btn-outline-dark btn-sm rounded-circle">
                  <FaPrint />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
