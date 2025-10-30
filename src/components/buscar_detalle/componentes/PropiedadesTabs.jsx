import React, { useState } from "react";
import config from "../../../config";

export default function PropiedadesTabs({ resultados }) {
  const [paginaActual, setPaginaActual] = useState(1); // <--- siempre al inicio
  const propiedadesPorPagina = 10;

  if (!resultados?.length) return null;

  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const crearUrlPropiedad = (propiedad) => {
    const slug = slugify(propiedad.titulo);
    const ciudad = slugify(propiedad.ubicacion);
    return `/anuncio/${propiedad.id}-${slug}-${ciudad}`;
  };

  // Cálculo de propiedades visibles en la página actual
  const indexUltima = paginaActual * propiedadesPorPagina;
  const indexPrimera = indexUltima - propiedadesPorPagina;
  const propiedadesActuales = resultados.slice(indexPrimera, indexUltima);

  // Número de páginas
  const totalPaginas = Math.ceil(resultados.length / propiedadesPorPagina);

  // Generar array de números de página
  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) {
    paginas.push(i);
  }


  return (
    <div className="tab-style-1 tab-style-3">
      <div className="tab-content" id="myTabContent">
        {/* Grid view */}
        <div className="tab-pane fade" id="mylisting" role="tabpanel">
          <div className="row">
            {resultados.map((propiedad, index) => (
              <div 
                className="col-lg-6 col-md-6" 
                key={index}
                onClick={() => window.location.href = crearUrlPropiedad(propiedad)}
                style={{ cursor: 'pointer' }}
              >
                <div className="property-box2 wow fadeInUp animated" data-wow-delay=".3s">
                  <div className="item-img">
                    <img
                      src={
                        propiedad.imagen_principal
                          ? `${config.urlserver}${propiedad.imagen_principal}`
                          : `${config.urlserver}uploads/default.jpg`
                      }
                      alt={propiedad.titulo}
                      width="510"
                      height="340"
                      className="img-fluid"
                    />
                    <div className="item-category-box1">
                      <div className="item-category">{propiedad.operaciones}</div>
                    </div>
                    <div className="rent-price">
                      <div className="item-price">${propiedad.precio}<span><i>/</i>mo</span></div>
                    </div>
                  </div>
                  <div className="item-category10">
                    <span className="text-success fw-semibold">{propiedad.tipo_propiedad.toUpperCase()}</span>
                  </div>
                  <div className="item-content">
                    <div className="verified-area">
                      <h3 className="item-title">{propiedad.titulo.charAt(0).toUpperCase() + propiedad.titulo.slice(1).toLowerCase()}</h3>
                    </div>
                    <div className="location-area">
                      <i className="flaticon-maps-and-flags"></i>{propiedad.ubicacion}
                    </div>
                    <div className="item-categoery3">
                      <ul>
                        {propiedad.caracteristicas?.map((carac, idx) => (
                          <li key={idx}>
                            <img
                              src={`${config.urlserver}iconos/${carac.icono}`}
                              alt={carac.nombre}
                              width="20"
                              height="20"
                              className="me-1 align-text-bottom"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                            {carac.valor} {carac.unidad ? ` ${carac.unidad}` : ""} {carac.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

            {/* Paginación */}
            <div className="pagination-style-1 mt-4">
              <ul className="pagination">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(paginaActual - 1)}
                  >
                    «
                  </button>
                </li>
                {paginas.map((num) => (
                  <li key={num} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(paginaActual + 1)}
                  >
                    »
                  </button>
                </li>
              </ul>
            </div>
        </div>

        {/* List view */}
        <div className="tab-pane fade show active" id="reviews" role="tabpanel">
          <div className="row">
            {resultados.map((propiedad, index) => (
              <div 
                className="col-lg-12" 
                key={index}
                onClick={() => window.location.href = crearUrlPropiedad(propiedad)}
                style={{ cursor: 'pointer' }}
              >
                <div className="property-box2 property-box4 wow fadeInUp animated" data-wow-delay=".6s">
                  <div className="item-img">
                    <img
                      src={
                        propiedad.imagen_principal
                          ? `${config.urlserver}${propiedad.imagen_principal}`
                          : `${config.urlserver}uploads/default.jpg`
                      }
                      alt={propiedad.titulo}
                      width="250"
                      height="200"
                      className="img-fluid"
                    />
                    
                    <div className="item-category-box1">
                      <div className="item-category">{propiedad.operaciones}</div>
                    </div>
                  </div>
                  <div className="item-content item-content-property">
                    <div className="item-category10">
                      <span className="text-success fw-semibold">{propiedad.tipo_propiedad.toUpperCase()}</span>
                    </div>
                    <div className="verified-area">
                      <h3 className="item-title">{propiedad.titulo.charAt(0).toUpperCase() + propiedad.titulo.slice(1).toLowerCase()}</h3>
                    </div>
                    <div className="location-area">
                      <i className="flaticon-maps-and-flags"></i>{propiedad.direccion} - {propiedad.ubicacion}
                    </div>
                    <div className="item-categoery3">
                      <ul>
                        {propiedad.caracteristicas?.map((carac, idx) => (
                          <li key={idx}>
                            <img
                              src={`${config.urlserver}iconos/${carac.icono}`}
                              alt={carac.nombre}
                              width="20"
                              height="20"
                              className="me-1 align-text-bottom"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                            {carac.valor} {carac.unidad ? ` ${carac.unidad}` : ""} {carac.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="pagination-style-1 mt-4">
            <ul className="pagination">
              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(paginaActual - 1)}
                >
                  «
                </button>
              </li>
              {paginas.map((num) => (
                <li key={num} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(num)}
                  >
                    {num}
                  </button>
                </li>
              ))}
              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(paginaActual + 1)}
                >
                  »
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
