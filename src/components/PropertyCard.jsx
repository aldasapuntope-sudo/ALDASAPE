import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../css/PropertyCard.css";
import { Card } from "react-bootstrap";
import config from "../config";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/UserContext";
import WhatsappModal from "./modales/WhatsappModal";

export default function PropertyCard({ anuncio }) {
  const navigate = useNavigate();
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const { usuario } = useUsuario();
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [autorizaUso, setAutorizaUso] = useState(false);

  const imagen = anuncio.imagen
    ? `${config.urlserver}${anuncio.imagen}`
    : "https://aldasa.pe/wp-content/themes/theme_aldasape/img/comprar-inmueble.jpg";


  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nombreValido = nombre.trim().length >= 3;
  const telefonoValido = telefono.trim().length >= 9;

  const formularioValido =
    emailValido &&
    nombreValido &&
    telefonoValido &&
    aceptaTerminos &&
    autorizaUso;
   // 🔹 Función para crear slug (nombre amigable)
  const crearSlug = (texto) => {
    return texto
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // reemplaza todo lo que no sea letra o número por guiones
      .replace(/^-+|-+$/g, ""); // elimina guiones del inicio y fin
  };

  
    useEffect(() => {
      if (usuario && showWhatsappModal) {
        setEmail(usuario?.usuarioaldasa?.email || "");
        setNombre(usuario?.usuarioaldasa?.nombre || "");
        setTelefono(usuario?.usuarioaldasa?.telefono_movil || "");
      }
    }, [usuario, showWhatsappModal]);

  const handleClick = () => {
    const slugTitulo = crearSlug(anuncio.titulo);
    const slugUbicacion = crearSlug(anuncio.ubicacion);
    // Redirige a /anuncio/23-titulo-ubicacion
    navigate(`/anuncio/${anuncio.id}-${slugTitulo}-${slugUbicacion}`);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  };

  const getImagenPerfil = (imagen) => {
    if (!imagen) return `${config.urlserver}image/animoji-1.png`;

    // Si ya es una URL externa (Google, Facebook, etc.)
    if (imagen.startsWith("http://") || imagen.startsWith("https://")) {
      return imagen;
    }

    // Si es imagen local
    return `${config.urlserver}${imagen}`;
  };


  const openWhatsappModal = (propiedad) => {
    setPropiedadSeleccionada(propiedad);
    setShowWhatsappModal(true);
  };



  console.log(anuncio);
  return (
   <>
    <Card
      className="property-box2 shadow-sm border-0 rounded-2 overflow-hidden h-100 property-card-hover"
      style={{ cursor: "pointer" }}
      onClick={() => {
        handleClick();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <div className="position-relative">
        <img
          src={imagen}
          alt={anuncio.titulo}
          className="w-100"
          style={{ height: "230px", objectFit: "cover" }}
        />

        <div className="item-category-box1">
          <div className="item-category">{anuncio.operacion}</div>
        </div>

        <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-75 text-white px-3 py-2 rounded-end">
          <strong>{anuncio.simbolo} {formatearPrecio(anuncio.precio)}</strong>
        </div>
      </div>

      <div className="item-category10 mt-2">
        <a href="#" className="text-success fw-semibold">
          {anuncio.tipo?.toUpperCase()}
        </a>
      </div>

      <Card.Body className="p-3">
        <h5
          className="mb-1 text-truncate"
          style={{ textAlign: "justify", width: "294px" }}
        >
          {anuncio.titulo}
        </h5>
        <div className="text-muted small mb-2 d-flex align-items-center">
          <FaMapMarkerAlt className="text-success me-2" />
          {anuncio.direccion
            ? `${anuncio.direccion} - ${anuncio.ubicacion}`
            : anuncio.ubicacion}
        </div>

        <ul className="list-inline mb-0 small text-secondary">
          {anuncio.caracteristicas?.length > 0 &&
            anuncio.caracteristicas.map((carac, index) => (
              <li key={index} className="list-inline-item me-3">
                <img
                  src={`${config.urlserver}iconos/${carac.icono}`}
                  alt={carac.nombre}
                  width="20"
                  height="20"
                  className="me-1 align-text-bottom"
                  onError={(e) => (e.target.style.display = "none")}
                />
                {carac.valor} {carac.unidad ? ` ${carac.unidad}` : ""}{" "}
                {carac.nombre}
              </li>
            ))}
        </ul>

        {/* <div className="d-flex flex-wrap gap-2 mt-2" style={{ float: "right" }}>
          {anuncio.caracteristicas_secundarios?.length > 0 &&
            anuncio.caracteristicas_secundarios.map((amenity, index) => (
              <div
                key={index}
                className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                style={{
                  backgroundColor: "var(--green)",
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: "500",
                }}
              >
                
                <span>{amenity.nombre}</span>
              </div>
            ))}
        </div> */}
        <div className="d-flex justify-content-between align-items-center mt-4">

                        {/* IZQUIERDA → FOTO USUARIO */}
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={getImagenPerfil(anuncio.perfilanunciante?.imagen)}
                            alt="Anunciante"
                            width="40"
                            height="40"
                            className="rounded-circle object-fit-cover"
                            onClick={(e) => e.stopPropagation()}
                            onError={(e) => {
                              e.target.src = `${config.urlserver}image/animoji-1.png`;
                            }}
                          />

                          <span className="fw-semibold small">
                            {anuncio.perfilanunciante?.nombre || "Anunciante"}
                          </span>
                        </div>

                        {/* DERECHA → BOTONES */}
                        <div className="d-flex gap-2">

                          {anuncio.perfilanunciante?.telefono_movil && (
                            <button
                              className="btn btn-success btn-sm d-flex align-items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                openWhatsappModal(anuncio);
                              }}
                            >
                              <i className="fab fa-whatsapp"></i>
                              WhatsApp
                            </button>
                          )}

                          {anuncio.perfilanunciante?.telefono && (
                            <a
                              href={`tel:${anuncio.perfilanunciante.telefono}`}
                              className="btn btn-outline-success btn-sm d-flex align-items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-phone"></i>
                            </a>
                          )}

                        </div>
                      </div>
      </Card.Body>
    </Card>
    <WhatsappModal
      show={showWhatsappModal}
      onClose={() => setShowWhatsappModal(false)}
      email={email}
      setEmail={setEmail}
      nombre={nombre}
      setNombre={setNombre}
      telefono={telefono}
      setTelefono={setTelefono}
      aceptaTerminos={aceptaTerminos}
      setAceptaTerminos={setAceptaTerminos}
      autorizaUso={autorizaUso}
      setAutorizaUso={setAutorizaUso}
      formularioValido={formularioValido}
      propiedad={propiedadSeleccionada}
    />

   </>
  );
}
