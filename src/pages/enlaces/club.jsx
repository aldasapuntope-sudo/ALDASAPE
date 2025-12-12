import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../css/TerminosCondiciones.css";
import Breadcrumb from "../../components/Breadcrumb";
import NotFound from "../../components/NotFound";
import { SkeletonInformacion } from "../../components/TablaSkeleton";
import { useUsuario } from "../../context/UserContext";
import config from "../../config";
import BreadcrumbALDASA from "../../cuerpos_dashboard/BreadcrumbAldasa";
import Swal from "sweetalert2";

export default function Club() {
  const { usuario } = useUsuario();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mostrarPrecios, setMostrarPrecios] = useState(false); // NO usuario
  const [abrirPopup, setAbrirPopup] = useState(false); // SÍ usuario
  const [mostrarNewsletter, setMostrarNewsletter] = useState(false);
  const [emailSubs, setEmailSubs] = useState("");
  const handleSuscribir = async () => {

    // Validar vacío
    if (!emailSubs.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor ingresa un correo electrónico.",
      });
      return;
    }

    // Validar formato de correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(emailSubs)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }

    // Enviar petición a API
    try {
      const res = await axios.post(`${config.apiUrl}api/suscripciones`, {
        correo: emailSubs,
      });

      Swal.fire({
        icon: "success",
        title: "Suscripción exitosa",
        text: "Gracias por suscribirte a Aldasa Club!",
      });

      setEmailSubs("");
      setMostrarNewsletter(false);

    } catch (error) {
      console.error("Error al suscribir:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al suscribirte. Inténtalo nuevamente.",
      });
    }
  };

  const modalNewsletter = (
  <section className="newsletter-wrap1 p-4">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-12">
          <div className="newsletter-layout1">
            <div className="item-heading">
              <h2 className="item-title">Suscribirse al boletín de Aldasa Club</h2>
              <h3 className="item-subtitle">Obtén las últimas noticias y actualizaciones</h3>
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="newsletter-form">
            <div className="input-group">
              
              <input
                type="text"
                className="form-control"
                placeholder="Ingresa tu correo"
                value={emailSubs}
                onChange={(e) => setEmailSubs(e.target.value)}
              />

              <button
                className="btn btn-outline-secondary"
                onClick={handleSuscribir}
              >
                Subscribe
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}api/paginaprincipal/club`);
        setData(res.data[0]);
      } catch (error) {
        console.error("Error al obtener información de Club:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const timer = setTimeout(() => {
      setMostrarNewsletter(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SkeletonInformacion />;
  if (!data) return <NotFound />;

  const decodeHTML2 = (html) => {
    if (!html) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    let decoded = txt.value;
    decoded = decoded.replace(/\u00A0/g, " ");
    decoded = decoded.replace(/\u200B/g, "");
    decoded = decoded.replace(/\s+/g, " ");
    decoded = decoded.replace(/<br\s*\/?>/gi, "");
    return decoded;
  };

  // ----------------------------------
  // CONTENIDO DE LOS PLANES (REUTILIZABLE)
  // ----------------------------------
  const contenidoPrecios = (
    <div className="container">
      <div className="item-heading-center mb-20">
        <span className="section-subtitle">Tabla de precios</span>
        <h2 className="section-title">Planes de precios</h2>
        <div className="bg-title-wrap" style={{ display: "block" }}>
          <span className="background-title solid">Aldasa</span>
        </div>
      </div>

      <div className="row justify-content-center">

        {/* --- PLAN 1 --- */}
        <div className="col-xl-4 col-lg-6 col-md-6">
          <div className="pricing-box1">
            <div className="heading-title">
              <h3 className="item-title">BASIC</h3>
              <div className="item-price">$15<span>/ month</span></div>
              <p>Shen an unknown printer took a galley of type and scrambled</p>
            </div>

            <div className="shape-img1">
              <img src="/assets/images/favicon-aldasape.png" alt="ALDASA Logo"
                style={{ height: 50, width: 50 }} />
            </div>

            <div className="pricing-list">
              <ul>
                <li className="available"><i className="fas fa-check-circle"></i>All Listing Access</li>
                <li className="available"><i className="fas fa-check-circle"></i>Location Wise Map</li>
                <li className="available"><i className="fas fa-check-circle"></i>Free / Pro Ads</li>
                <li className="available"><i className="fas fa-check-circle"></i>Custom Map Setup</li>
                <li className="available"><i className="fas fa-check-circle"></i>Apps Integrated</li>
                <li className="available"><i className="fas fa-check-circle"></i>Advanced Custom Field</li>
                <li className="available"><i className="fas fa-check-circle"></i>Pro Features</li>
              </ul>
            </div>

          </div>
        </div>

        {/* --- PLAN 2 --- */}
        <div className="col-xl-4 col-lg-6 col-md-6">
          <div className="pricing-box1">
            <div className="heading-title">
              <h3 className="item-title">STANDARD</h3>
              <div className="item-price">$29<span>/ month</span></div>
              <p>Shen an unknown printer took a galley of type and scrambled</p>
            </div>

            <div className="shape-img1">
              <img src="/assets/images/favicon-aldasape.png" alt="ALDASA Logo"
                style={{ height: 50, width: 50 }} />
            </div>

            <div className="pricing-list">
              <ul>
                <li className="available"><i className="fas fa-check-circle"></i>All Listing Access</li>
                <li className="available"><i className="fas fa-check-circle"></i>Location Wise Map</li>
                <li className="available"><i className="fas fa-check-circle"></i>Free / Pro Ads</li>
                <li className="available"><i className="fas fa-check-circle"></i>Custom Map Setup</li>
                <li className="available"><i className="fas fa-check-circle"></i>Apps Integrated</li>
                <li className="available"><i className="fas fa-check-circle"></i>Advanced Custom Field</li>
                <li className="available"><i className="fas fa-check-circle"></i>Pro Features</li>
              </ul>
            </div>

          </div>
        </div>

        {/* --- PLAN 3 --- */}
        <div className="col-xl-4 col-lg-6 col-md-6">
          <div className="pricing-box1">
            <div className="heading-title">
              <h3 className="item-title">PREMIUM</h3>
              <div className="item-price">$45<span>/ month</span></div>
              <p>Shen an unknown printer took a galley of type and scrambled</p>
            </div>

            <div className="shape-img1">
              <img src="/assets/images/favicon-aldasape.png" alt="ALDASA Logo"
                style={{ height: 50, width: 50 }} />
            </div>

            <div className="pricing-list">
              <ul>
                <li className="available"><i className="fas fa-check-circle"></i>All Listing Access</li>
                <li className="available"><i className="fas fa-check-circle"></i>Location Wise Map</li>
                <li className="available"><i className="fas fa-check-circle"></i>Free / Pro Ads</li>
                <li className="available"><i className="fas fa-check-circle"></i>Custom Map Setup</li>
                <li className="available"><i className="fas fa-check-circle"></i>Apps Integrated</li>
                <li className="available"><i className="fas fa-check-circle"></i>Advanced Custom Field</li>
                <li className="available"><i className="fas fa-check-circle"></i>Pro Features</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  // ----------------------------------
  // BOTÓN: SI HAY USUARIO O NO
  // ----------------------------------
  const botonPlan = (
    <div className="pricing-button text-center mt-3">
      {!usuario ? (
        <div className="about-button">
          <a 
            className="item-btn" 
            onClick={() => setMostrarPrecios(!mostrarPrecios)}
          >
            Ver precios
          </a>
        </div>
      ) : (
        <div className="about-button">
          <a 
            className="item-btn" 
            onClick={() => setAbrirPopup(true)}
          >
            Ver planes
          </a>
        </div>
      )}

    </div>
  );

  return (
    <>
      <div className="container mt-4">
        {usuario ? <BreadcrumbALDASA /> : <Breadcrumb />}
      </div>

      <section className="about-wrap2 rounded-4 py-5 mt-5" style={{ background: 'white' }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: "var(--green)" }}>
          {data.titulo || "Términos y Condiciones"}
        </h2>

        <div className="container" dangerouslySetInnerHTML={{ __html: decodeHTML2(data.contenido) }} />
        {botonPlan}
      </section>

      {/* BOTÓN DINÁMICO */}
      

      {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
          DESPLEGABLE PARA NO REGISTRADOS
      ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
      {!usuario && mostrarPrecios && (
        <motion.section
          className="pricing-wrap1 rounded-4 mt-4"
          style={{ background: "white" }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {contenidoPrecios}
        </motion.section>
      )}

      {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
          POPUP PARA USUARIOS REGISTRADOS
      ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
      {usuario && abrirPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="cerrar-popup" onClick={() => setAbrirPopup(false)}>✖</button>
            {contenidoPrecios}
          </div>
        </div>
      )}

      {mostrarNewsletter && (
        <div className="popup-overlay">
          <div className="popup-content" style={{ maxWidth: "700px" }}>
            <button
              className="cerrar-popup"
              onClick={() => setMostrarNewsletter(false)}
            >
              ✖
            </button>

            {modalNewsletter}
          </div>
        </div>
      )}

    </>
  );
}
