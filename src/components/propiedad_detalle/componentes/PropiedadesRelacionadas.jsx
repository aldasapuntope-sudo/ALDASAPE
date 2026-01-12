import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config";

export default function PropiedadesRelacionadas({ tipoId, idpropiedad, operaciones }) {
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    if (!tipoId || !idpropiedad) return;

    axios
      .get(
        `${config.apiUrl}api/paginaprincipal/propiedades/relacionadas/${tipoId}/${idpropiedad}`
      )
      .then((res) => setPropiedades(res.data.data))
      .catch((err) => console.error(err));
  }, [tipoId, idpropiedad]);

  if (propiedades.length === 0) return null;

  // Función para generar slug tipo "1-departamento-de-lujoprueba-chiclayo"
  const generarSlug = (prop) => {
    const tituloSlug = prop.titulo
      ?.toLowerCase()
      .replace(/\s+/g, "-") // espacios → guiones
      .replace(/[^\w\-]+/g, ""); // quitar símbolos
    const ubicacionSlug = prop.ubicacion
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
    return `/anuncio/${prop.id}-${tituloSlug}-${ubicacionSlug}`;
  };

  const principal = propiedades[0];
  const restantes = propiedades.slice(1);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  };


  return (
    <div className="widget widget-listing-box1">
      <h3 className="widget-subtitle">Propiedades relacionadas</h3>

      {/* Propiedad principal destacada */}
      <div className="item-img">
        <a href={generarSlug(principal)}>
         <img
            src={
              principal.imagen_principal
                ? `${config.urlserver}${principal.imagen_principal}`
                : "/default.jpg"
            }
            alt={principal.titulo}
            width="540"
            height="360"
          />
        </a>
        <div className="item-category-box1">
          <div className="item-category">
            {operaciones?.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="widget-content">
        <div className="item-category10">
          <a href={generarSlug(principal)}>{principal.tipo_propiedad}</a>
        </div>
        <h4 className="item-title">
          <a href={generarSlug(principal)}>{principal.titulo}</a>
        </h4>
        <div className="location-area">
          <i className="flaticon-maps-and-flags"></i>
          {principal.direccion}
        </div>
        <div className="item-price">
          {principal.moneda_simbolo} {formatearPrecio(principal.precio)}
          
        </div>
      </div>

      {/* Otras propiedades */}
      {restantes.map((item, i) => (
        <div
          key={item.id}
          className={`widget-listing ${i === restantes.length - 1 ? "no-brd" : ""}`}
        >
          <div className="item-img">
            <a href={generarSlug(item)}>
              <img
                src={`${config.urlserver}${item.imagen_principal}`}
                alt={item.titulo}
                width="120"
                height="102"
              />
            </a>
          </div>
          <div className="item-content">
            <h5 className="item-title">
              <a href={generarSlug(item)}>{item.titulo}</a>
            </h5>
            <div className="location-area">
              <i className="flaticon-maps-and-flags"></i>
              {item.direccion}
            </div>
            <div className="item-price">
              {principal.moneda_simbolo} {formatearPrecio(item.precio)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
