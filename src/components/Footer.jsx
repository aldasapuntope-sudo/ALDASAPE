import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css/Footer.css";

export default function Footer({ fondo = "imagen" }) {
  const footerTopStyle = fondo === "imagen"
    ? { backgroundImage: "url('/assets/images/footer-bg1.jpg')" }
    : { backgroundColor: "#ffffff" };
  return (
    <footer className="footer-area">
      {/* Sección superior con imagen de fondo */}
      <div className="footer-top footer-top-style" style={footerTopStyle}>
        <div className="container">
          <div className="row justify-content-between">
            
            {/* Logo y descripción */}
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <div className="footer-logo-area footer-logo-area-2">
                <div className="item-logo mb-3">
                  <img
                    src="https://aldasa.pe/wp-content/uploads/2024/09/logo-aldasape.png"
                    width="157"
                    height="40"
                    alt="logo"
                    className="img-fluid"
                  />
                </div>
                <p>
                  Es el espacio publicitario donde las inmobiliarias y dueños directos publican sus inmuebles, por ende no somos propietarios de los avisos en este portal.
                </p>
                <div className="item-social mt-3">
                  <ul className="social-list">
                    <li>
                      <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
                        <FaFacebookF />
                      </a>
                    </li>
                    <li>
                      <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
                        <FaInstagram />
                      </a>
                    </li>
                    <li>
                      <a href="https://youtube.com" aria-label="Youtube" target="_blank" rel="noreferrer">
                        <FaYoutube />
                      </a>
                    </li>
                    <li>
                      <a href="https://web.whatsapp.com/" aria-label="WhatsApp" target="_blank" rel="noreferrer">
                        <FaWhatsapp />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enlaces directos */}
            <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6">
              <div className="footer-link footer-link-style-2">
                <h3 className="footer-title">Enlaces Directos</h3>
                <ul>
                  <li><a href="https://aldasa.pe/nosotros/">Nosotros</a></li>
                  <li><a href="#">Recién Publicados</a></li>
                  <li><Link to="/terminos-condiciones">Términos y condiciones</Link></li>
                  <li><Link to="/politicas-de-privacidad">Políticas de Privacidad</Link></li>
                  <li><Link to="/mi-cuenta">Mi Cuenta</Link></li>
                </ul>
              </div>
            </div>

            {/* Lugares más buscados */}
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer-insta">
                <h3 className="footer-title">Lugares más buscados</h3>
                <ul className="insta-link">
                  <li><a href="https://aldasa.pe/venta-de-propiedades-en-lima">Lima</a></li>
                  <li><a href="https://aldasa.pe/venta-de-propiedades-en-lambayeque">Lambayeque</a></li>
                  <li><a href="https://aldasa.pe/venta-de-propiedades-en-chiclayo">Chiclayo</a></li>
                  <li><a href="https://aldasa.pe/venta-de-propiedades-en-lima-surco">Surco</a></li>
                  <li><a href="https://aldasa.pe/venta-de-propiedades-en-lima-san-isidro">San Isidro</a></li>
                  <li><a href="https://aldasa.pe/venta-de-propiedades-en-lima-la-molina">La Molina</a></li>
                  <li><a href="https://aldasa.pe/venta-de-propiedades-en-lima-san-miguel">San Miguel</a></li>
                  <li><a href="https://aldasa.pe/venta-de-propiedades-en-lima-mardalena-del-mar">Magdalena</a></li>
                </ul>
              </div>
            </div>

            {/* Contacto */}
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer-contact footer-contact-style-2">
                <h3 className="footer-title">Contacto</h3>
                <ul className="footer-location">
                  <li><FaMapMarkerAlt /> Av. Santa Victoria 719 - Urb. Santa Victoria, Chiclayo, Perú</li>
                  <li><a href="mailto:info@aldasa.pe"><FaEnvelope /> info@aldasa.pe</a></li>
                  <li><FaPhoneAlt /> (+51) 999 999 999</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="footer-bottom footer-bottom-style-2">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 text-center">
              <p className="mb-0 d-flex justify-content-center align-items-center flex-wrap gap-2">
                <span>{new Date().getFullYear()} © Todos los derechos reservados.</span>
                <Link to="/">
                  <img
                    src="/assets/images/logo-aldasape-color.png"
                    alt="Aldasa Logo"
                    style={{ height: "30px", marginLeft: "8px", background: "#ffffff", padding: "0px 11px", borderRadius: "2px" }}
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
