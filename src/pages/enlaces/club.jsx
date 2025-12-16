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
import AnunciosActivosclub from "../dashboard/aldasa-club/AnunciosActivosclub";

export default function Club() {
  const { usuario } = useUsuario();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  //console.log(usuario);
  // UI
  const [mostrarPrecios, setMostrarPrecios] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [mostrarNewsletter, setMostrarNewsletter] = useState(false);

  // Newsletter
  const [emailSubs, setEmailSubs] = useState("");

  // 🔑 MEMBRESÍA
  const [verificandoMembresia, setVerificandoMembresia] = useState(true);
  const [membresiaActiva, setMembresiaActiva] = useState(false);

  /* ----------------------------------
     NEWSLETTER
  ---------------------------------- */
  const handleSuscribir = async () => {
    if (!emailSubs.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor ingresa un correo electrónico.",
      });
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(emailSubs)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }

    try {
      await axios.post(`${config.apiUrl}api/suscripciones`, {
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al suscribirte.",
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

  /* ----------------------------------
     OBTENER CONTENIDO CLUB
  ---------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}api/paginaprincipal/club`);
        setData(res.data[0]);
      } catch (error) {
        console.error(error);
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

  /* ----------------------------------
     VALIDAR MEMBRESÍA
  ---------------------------------- */
  useEffect(() => {
    if (!usuario) {
      setVerificandoMembresia(false);
      return;
    }
    
    axios
      .get(`${config.apiUrl}api/aldasaclub/estado-membresia/${usuario.usuarioaldasa.id}`)
      .then((res) => {
        setMembresiaActiva(res.data.activo === true);
      })
      .catch(() => setMembresiaActiva(false))
      .finally(() => setVerificandoMembresia(false));
  }, [usuario]);

  /* ----------------------------------
     CORTES DE RENDER
  ---------------------------------- */
  if (loading || verificandoMembresia) return <SkeletonInformacion />;
  if (!data) return <NotFound />;

  // 👑 USUARIO CON MEMBRESÍA ACTIVA
  if (usuario && membresiaActiva) {
    return (
      <>
        <div className="container mt-4">
          <BreadcrumbALDASA />
        </div>

        {/* CONTENIDO EXCLUSIVO */}
        <AnunciosActivosclub />
      </>
    );
  }


  /* ----------------------------------
     UTIL
  ---------------------------------- */
  const decodeHTML2 = (html) => {
    if (!html) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  /* ----------------------------------
     CONTENIDO DE PLANES
  ---------------------------------- */
  const contenidoPrecios = (
    <div className="container">
      <h2 className="text-center mb-4">Planes de precios</h2>

      <div className="row justify-content-center">
        {["BASIC", "STANDARD", "PREMIUM"].map((plan, i) => (
          <div className="col-md-4" key={i}>
            <div className="pricing-box1">
              <h3>{plan}</h3>
              <p>Acceso exclusivo a propiedades</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ----------------------------------
     BOTÓN PLAN
  ---------------------------------- */
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

  /* ----------------------------------
     RENDER NORMAL
  ---------------------------------- */
  return (
    <>
      <div className="container mt-4">
        {usuario ? <BreadcrumbALDASA /> : <Breadcrumb />}
      </div>

      <section className="about-wrap2 rounded-4 py-5 mt-5" style={{ background: "white" }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: "var(--green)" }}>
          {data.titulo}
        </h2>

        <div
          className="container"
          dangerouslySetInnerHTML={{ __html: decodeHTML2(data.contenido) }}
        />

        {botonPlan}
      </section>

      {!usuario && mostrarPrecios && (
        <motion.section
          className="pricing-wrap1 rounded-4 mt-4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
        >
          {contenidoPrecios}
        </motion.section>
      )}

      {usuario && abrirPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="cerrar-popup" onClick={() => setAbrirPopup(false)}>
              ✖
            </button>
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
