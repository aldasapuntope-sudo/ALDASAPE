import React, { useEffect, useState } from "react";
import config from "../../../config";
import { useUsuario } from "../../../context/UserContext";

export default function PropiedadesTabs({ resultados }) {
  
  const [paginaActual, setPaginaActual] = useState(1); // <--- siempre al inicio
  const propiedadesPorPagina = 10;
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
const { usuario } = useUsuario();
const [email, setEmail] = useState("");
const [nombre, setNombre] = useState("");
const [telefono, setTelefono] = useState("");

const [aceptaTerminos, setAceptaTerminos] = useState(false);
const [autorizaUso, setAutorizaUso] = useState(false);

console.log(usuario?.usuarioaldasa?.email);
useEffect(() => {
  if (usuario && showWhatsappModal) {
    setEmail(usuario?.usuarioaldasa?.email || "");
    setNombre(usuario?.usuarioaldasa?.nombre || "");
    setTelefono(usuario?.usuarioaldasa?.telefono_movil || "");
  }
}, [usuario, showWhatsappModal]);


const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const nombreValido = nombre.trim().length >= 3;
const telefonoValido = telefono.trim().length >= 9;

const formularioValido =
  emailValido &&
  nombreValido &&
  telefonoValido &&
  aceptaTerminos &&
  autorizaUso;


const openWhatsappModal = (propiedad) => {
  setPropiedadSeleccionada(propiedad);
  setShowWhatsappModal(true);
};
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
    <>
      <div className="tab-style-1 tab-style-3">
      <div className="tab-content" id="myTabContent">
        {/* Grid view */}
        <div className="tab-pane fade" id="mylisting" role="tabpanel">
          <div className="row">
            {resultados.map((propiedad, index) => (
              <div 
                className="col-lg-6 col-md-6" 
                key={index}
                
              >
                <div className="property-box2 wow fadeInUp animated" data-wow-delay=".6s"
                    onClick={() => window.location.href = crearUrlPropiedad(propiedad)}
                    style={{ cursor: "pointer" }}>
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
                    <div className="d-flex justify-content-between align-items-start mt-2">
                      <div className="item-categoery4">
                       
                      </div>

                      {/* BOTONES DERECHA */}
                      <div className="d-flex gap-2">
                        {/* WhatsApp */}
                        {propiedad.perfilanunciante?.telefono_movil && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => openWhatsappModal(propiedad)}
                          >
                            Whatsapp
                            <i className="fab fa-whatsapp"></i>
                          </button>
                        )}

                        {/* Llamar */}
                        {propiedad.perfilanunciante?.telefono && (
                          <a
                            href={`tel:${propiedad.perfilanunciante.telefono}`}
                            className="btn btn-outline-success btn-sm"
                          >
                            <i className="fas fa-phone"></i>
                          </a>
                        )}
                      </div>
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
              <>
                <div className="col-lg-12" key={index}>
  
                  {/* CARD CLICKEABLE */}
                  <div
                    className="property-box2 property-box4 wow fadeInUp animated"
                    data-wow-delay=".6s"
                    onClick={() => window.location.href = crearUrlPropiedad(propiedad)}
                    style={{ cursor: "pointer" }}
                  >
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
                        <span className="text-success fw-semibold">
                          {propiedad.tipo_propiedad.toUpperCase()}
                        </span>
                      </div>

                      <div className="verified-area">
                        <h3 className="item-title">
                          {propiedad.titulo.charAt(0).toUpperCase() +
                            propiedad.titulo.slice(1).toLowerCase()}
                        </h3>
                      </div>

                      <div className="location-area">
                        <i className="flaticon-maps-and-flags"></i>
                        {propiedad.direccion} - {propiedad.ubicacion}
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
                              {carac.valor}
                              {carac.unidad ? ` ${carac.unidad}` : ""} {carac.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-2">
                    
                    {propiedad.perfilanunciante?.telefono_movil && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openWhatsappModal(propiedad);
                        }}
                      >
                        Whatsapp
                        <i className="fab fa-whatsapp"></i>
                      </button>
                    )}

                    {propiedad.perfilanunciante?.telefono && (
                      <a
                        href={`tel:${propiedad.perfilanunciante.telefono}`}
                        className="btn btn-outline-success btn-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fas fa-phone"></i>
                      </a>
                    )}
                  </div>
                    </div>
                  </div>


                </div>

              </>
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
    {showWhatsappModal && propiedadSeleccionada && (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        {/* HEADER */}
        <div className="modal-header">
          <h5 className="modal-title">
            ¡Completa tus datos y encuentra tu próximo hogar!
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowWhatsappModal(false)}
          />
        </div>

        {/* BODY */}
        <div className="modal-body">

          {/* EMAIL */}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* NOMBRE */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Nombre"
            value={nombre}
            disabled={!emailValido}
            onChange={(e) => setNombre(e.target.value)}
          />

          {/* TELEFONO */}
          <input
            type="tel"
            className="form-control mb-3"
            placeholder="Teléfono"
            value={telefono}
            disabled={!nombreValido}
            onChange={(e) => setTelefono(e.target.value)}
          />

          {/* CHECKS */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            <label className="form-check-label">
              Acepto los{" "}
              <a href="http://localhost:3000/terminos-condiciones" target="_blank">
                Términos y Condiciones
              </a>{" "}
              y las{" "}
              <a href="http://localhost:3000/politicas-de-privacidad" target="_blank">
                Políticas de Privacidad
              </a>
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={autorizaUso}
              onChange={(e) => setAutorizaUso(e.target.checked)}
            />
            <label className="form-check-label">
              Autorizo el uso de mi información para fines adicionales
            </label>
          </div>

          {/* BOTON */}
          <a
            href={
              formularioValido
                ? `https://wa.me/51${propiedadSeleccionada.perfilanunciante.telefono_movil}?text=${encodeURIComponent(
                    `Hola, soy ${nombre}. Mi correo es ${email} y mi teléfono ${telefono}. Estoy interesado en la propiedad: ${propiedadSeleccionada.titulo}`
                  )}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`btn w-100 ${
              formularioValido ? "btn-success" : "btn-secondary disabled"
            }`}
          >
            Enviar
          </a>

        </div>
      </div>
    </div>
  </div>
)}


    </>
  );
}
