import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaShareAlt,
  FaHeart,
  FaArrowsAltH,
  FaPrint,
  FaClock,
  FaEye,
} from "react-icons/fa";
import config from "../../../config";

// ⏱️ Función para mostrar tiempo relativo
const tiempoTranscurrido = (fecha) => {
  if (!fecha) return "Fecha no disponible";
  const ahora = new Date();
  const creada = new Date(fecha);
  const diff = ahora - creada;
  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const meses = Math.floor(dias / 30);
  const años = Math.floor(meses / 12);

  if (años > 0) return `Hace ${años} año${años > 1 ? "s" : ""}`;
  if (meses > 0) return `Hace ${meses} mes${meses > 1 ? "es" : ""}`;
  if (dias > 0) return `Hace ${dias} día${dias > 1 ? "s" : ""}`;
  if (horas > 0) return `Hace ${horas} hora${horas > 1 ? "s" : ""}`;
  if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? "s" : ""}`;
  return "Hace unos segundos";
};

export default function PropertyHeading({ anuncio }) {
  const [tipoCambio, setTipoCambio] = useState(null);
  

  // 🔄 Obtener tipo de cambio actual de la API de la SUNAT
  useEffect(() => {
    const obtenerTipoCambio = async () => {
      try {
        const res = await fetch(`${config.apiUrl}api/paginaprincipal/tipo-cambio`);
        const data = await res.json();
        setTipoCambio(data.venta); // usamos el valor de venta
      } catch (error) {
        console.error("Error al obtener tipo de cambio:", error);
      }
    };
    obtenerTipoCambio();
  }, []);

  const precioSoles = parseFloat(anuncio?.precio) || 0;
  const precioDolares = tipoCambio
    ? (precioSoles / tipoCambio).toFixed(2)
    : null;

  return (
    <div className="property-heading">
      {/* 🏷️ Operación y precio */}
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="single-list-cate">
            <div className="item-categoery text-uppercase fw-semibold text-success">
              {anuncio?.operaciones
                ? anuncio.operaciones.toUpperCase()
                : "SIN OPERACIÓN"}
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="single-list-price text-end fs-4 fw-bold text-primary">
            <div>
               SOL = S/{" "}
              {precioSoles.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
              })}
            </div>
            {precioDolares ? (
              <small className="text-muted">
                USD = ${precioDolares.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </small>
            ) : (
              <small className="text-muted">Cargando tipo de cambio...</small>
            )}
          </div>
        </div>
      </div>

      {/* 🏠 Título y dirección */}
      <div className="row align-items-center ">
        <div className="col-lg-8 col-md-12">
          <div className="single-verified-area">
            <div className="item-title">
              <h3 className="fw-bold text-dark mb-2">
                {anuncio?.titulo || "Propiedad sin título"}
              </h3>
            </div>
          </div>

          {/* 📍 Dirección, tiempo y vistas */}
          <div className="single-item-address text-muted">
            <ul className="list-unstyled mb-0 d-flex flex-wrap align-items-center gap-3">
              <li>
                <FaMapMarkerAlt
                  className="me-2"
                  style={{ color: "var(--green)", fontSize: "19px" }}
                />
                {anuncio?.direccion
                  ? `${anuncio.direccion} - ${anuncio.ubicacion}`
                  : anuncio?.ubicacion || "Ubicación no disponible"}
                {" /"}
              </li>
              <li>
                <FaClock
                  className="me-2"
                  style={{ color: "var(--green)", fontSize: "19px" }}
                />
                {tiempoTranscurrido(anuncio?.created_at)} {" /"}
              </li>
              <li>
                <FaEye
                  className="me-2"
                  style={{ color: "var(--green)", fontSize: "19px" }}
                />
                Vistas: {(anuncio?.visitas ?? 0) + 1}
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
