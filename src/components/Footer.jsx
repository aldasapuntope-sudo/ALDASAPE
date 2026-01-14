import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../config";
import "../css/Footer.css";
import { useUsuario } from "../context/UserContext";

export default function Footer({ fondo = "imagen" }) {
  const [lugares, setLugares] = useState([]);
  const [configuracion, setConfiguracion] = useState({});
  const { usuario } = useUsuario();

  useEffect(() => {
    axios.get(`${config.apiUrl}api/paginaprincipal/lugares-mas-buscados`)
      .then(res => setLugares(res.data))
      .catch(err => console.error("Error al cargar lugares:", err));

    axios.get(`${config.apiUrl}api/paginaprincipal/obtener-configuraciones`)
      .then(res => setConfiguracion(res.data))
      .catch(err => console.error("Error al cargar configuraciones:", err));
  }, []);

  const footerTopStyle =
    fondo === "imagen"
      ? { backgroundImage: "url('/assets/images/footer-bg1.jpg')" }
      : { backgroundColor: "#ffffff" };

  return (
    <footer className="footer-area">
      <div className="footer-top footer-top-style" style={footerTopStyle}>
        <div className="container">
          <div className="row justify-content-between">

            {/* Logo y descripción */}
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <div className="footer-logo-area footer-logo-area-2">
                <div className="item-logo mb-3">
                  <img
                    src={
                      configuracion.logo
                        ? configuracion.logo.startsWith("http")
                          ? configuracion.logo
                          : `${config.urlserver}${configuracion.logo}`
                        : "/assets/images/logo-aldasape-color.png"
                    }
                    width="157"
                    height="40"
                    alt="logo"
                    className="img-fluid"
                  />
                </div>
                <p>
                  {configuracion.descripcioncorta}
                </p>
                <div className="item-social mt-3">
                  <ul className="social-list">
                    {configuracion.facebook && <li><a href={configuracion.facebook} target="_blank" rel="noreferrer"><FaFacebookF /></a></li>}
                    {configuracion.instagram && <li><a href={configuracion.instagram} target="_blank" rel="noreferrer"><FaInstagram /></a></li>}
                    {configuracion.youtube && <li><a href={configuracion.youtube} target="_blank" rel="noreferrer"><FaYoutube /></a></li>}
                    {configuracion.whatsapp && <li><a href={configuracion.whatsapp} target="_blank" rel="noreferrer"><FaWhatsapp /></a></li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Enlaces */}
            <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6">
              <div className="footer-link footer-link-style-2">
                <h3 className="footer-title">Enlaces Directos</h3>
                <ul>
                  <li><Link to="/nosotros"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Nosotros</Link></li>
                  <li><Link to="/buscar"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Recién Publicados</Link></li>
                  <li><Link to="/terminos-condiciones"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Términos y condiciones</Link></li>
                  <li><Link to="/politicas-de-privacidad"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Políticas de Privacidad</Link></li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        
                        if (usuario != null) {
                          window.location.href = "/mi-perfil";
                        } else {
                          window.location.href = "/login";
                        }
                      }}
                    >
                      Mi Cuenta
                    </a>
                </li>
                </ul>
              </div>
            </div>

            {/* Lugares dinámicos */}
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer-insta">
                <h3 className="footer-title">Lugares más buscados</h3>
                <ul className="insta-link">
                  {lugares.length > 0 ? (
                    lugares.map((lugar) => (
                      <li key={lugar.id}>
                        <Link to={`/buscar?ciudad=${lugar.nombre}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{lugar.nombre}</Link>
                      </li>
                    ))
                  ) : (
                    <li>Cargando...</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Contacto */}
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer-contact footer-contact-style-2">
                <h3 className="footer-title">Contacto</h3>
                <ul className="footer-location">
                  <li>
                    <FaMapMarkerAlt /> {configuracion.direccion || "Dirección no disponible"}
                  </li>

                  {configuracion.correo && (
                    <li>
                      <a href={`mailto:${configuracion.correo}`}>
                        <FaEnvelope /> {configuracion.correo}
                      </a>
                    </li>
                  )}

                  {configuracion.telefono && (
                    <li>
                      <FaPhoneAlt /> {configuracion.telefono}
                    </li>
                  )}
                </ul>

                {/* LIBRO DE RECLAMACIONES */}
                <div className="mt-3">
                  <Link to="/libro-de-reclamaciones">
                    <img
                      src="/assets/images/libro-reclamaciones.png"
                      alt="Libro de Reclamaciones"
                      className="img-fluid"
                      style={{ maxWidth: "180px", cursor: "pointer", background: "white", padding: "7px 24px", borderRadius: "8px" }}
                    />
                  </Link>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div className="footer-bottom footer-bottom-style-2">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 text-center">
              <p className="mb-0 d-flex justify-content-center align-items-center flex-wrap gap-2">
                <span>{new Date().getFullYear()} © Todos los derechos reservados.</span>
                <Link to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  <img
                    src={
                      configuracion.logo_footer
                        ? configuracion.logo_footer.startsWith("http")
                          ? configuracion.logo_footer
                          : `${config.urlserver}${configuracion.logo_footer}`
                        : "/assets/images/default-logo.png"
                    }
                    alt="Aldasa Logo"
                    style={{
                      height: "30px",
                      marginLeft: "8px",
                      background: "#ffffff",
                      padding: "0px 11px",
                      borderRadius: "2px",
                    }}
                  />

                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
