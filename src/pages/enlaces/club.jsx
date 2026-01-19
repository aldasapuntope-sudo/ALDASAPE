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
  const esAdmin = usuario?.usuarioaldasa?.perfil_id === 1;
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

  // PAGOS PLANES
  const [planes, setPlanes] = useState([]);
  const [cargandoPlanes, setCargandoPlanes] = useState(false);
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
      await axios.post(`${config.apiUrl}api/paginaprincipal/suscripciones`, {
        email: emailSubs,
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


  useEffect(() => {
    const fetchPlanes = async () => {
      setCargandoPlanes(true);
      try {
        const res = await axios.get(`${config.apiUrl}api/planes/listarclub`);
        setPlanes(res.data);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los planes", "error");
      } finally {
        setCargandoPlanes(false);
      }
    };

    fetchPlanes();
  }, []);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.culqi.com/js/v3";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handlePagoCulqi = (plan) => {
    if (!window.Culqi) {
      Swal.fire("Error", "Culqi aún no está listo.", "error");
      return;
    }

    window.Culqi.publicKey = "pk_test_aDdnZvQQ5srem5oX";

    window.Culqi.settings({
      title: plan.nombre,
      currency: "PEN",
      description: plan.descripcion,
      amount: plan.precio, // centavos
      order_id: `club_${plan.id}_${Date.now()}`,
    });

    window.Culqi.open();

    window.culqi = async function () {
      if (window.Culqi.token) {
        const culqi_token = window.Culqi.token.id;

        try {
          await axios.post(
            `${config.apiUrl}api/administracion/culqiclub`,
            {
              culqi_token,
              plan_id: plan.id,
            }
          );

          setAbrirPopup(false);

          Swal.fire({
            icon: "success",
            title: "Pago realizado",
            text: `Tu membresía ${plan.nombre} fue activada correctamente.`,
            confirmButtonText: "Continuar",
          }).then(() => {
            // 👉 recargar para que se valide membresía
            window.location.reload();
          });

        } catch (error) {
          Swal.fire("Error", "No se pudo registrar el pago", "error");
        }

        window.Culqi.close();
      } 
      else if (window.Culqi.error) {
        Swal.fire("Error", window.Culqi.error.user_message, "error");
        window.Culqi.close();
      }
    };
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

    
  // 👑 ADMIN: acceso directo
  if (esAdmin) {
    setMembresiaActiva(true);
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

  const decodeHTML3 = (html) => {
      if (!html) return "";

      // Decodifica entidades HTML
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      let decoded = txt.value;

      // Limpia caracteres NO-BREAK SPACE, unicode invisibles, etc.
      decoded = decoded.replace(/\u00A0/g, " "); // reemplaza NBSP por espacio normal
      decoded = decoded.replace(/\u200B/g, "");  // elimina zero-width
      decoded = decoded.replace(/\s+/g, " ");    // limpia espacios repetidos
      decoded = decoded.replace(/<br\s*\/?>/gi, "");

      return decoded;
    };


  /* ----------------------------------
     CONTENIDO DE PLANES
  ---------------------------------- */
  const contenidoPrecios = (
  <div className="container py-4">
    <h2 className="text-center mb-4">Planes de precios</h2>

    {cargandoPlanes ? (
      <div className="text-center">
        <span className="spinner-border text-success"></span>
      </div>
    ) : (
      <div className="row justify-content-center g-4">
        {planes.map((plan) => (
          <div className="col-md-4" key={plan.id}>
            <div
              className="pricing-box1 wow zoomIn h-100"
              data-wow-delay=".3s"
            >
              {/* ENCABEZADO */}
              <div className="heading-title text-center">
                <h3 className="item-title">{plan.nombre}</h3>

                <div className="item-price">
                  S/ {(plan.precio / 100).toFixed(2)}
                  <span> / mes</span>
                </div>

                
              </div>

              {/* SHAPE */}
              <div className="shape-img1 text-center my-3">
                <img
                  src="/assets/images/favicon-aldasape.png"
                  alt="shape"
                  width="50"
                />
              </div>
            
              <div
          className="container"
          dangerouslySetInnerHTML={{ __html: decodeHTML3(plan.descripcion) }}
        />
              {/*<p>{plan.descripcion}</p> */}
              {/* LISTA DE BENEFICIOS */}
              

              {/* BOTÓN */}
              {usuario && !esAdmin && (
                <div className="pricing-button text-center mt-4">
                  <button
                    className="item-btn"
                    onClick={() => handlePagoCulqi(plan)}
                  >
                    Pagar con Culqi
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
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
