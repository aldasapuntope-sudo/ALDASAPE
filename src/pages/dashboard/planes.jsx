import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BreadcrumbALDASA from "../../cuerpos_dashboard/BreadcrumbAldasa";
import axios from "axios";
import config from "../../config";
import Cargando from "../../components/cargando";

const Planes = () => {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(false);

  /* ----------------------------
     OBTENER PLANES
  ---------------------------- */
  useEffect(() => {
    const fetchPlanes = async () => {
      setCargando(true);
      try {
        const res = await axios.get(`${config.apiUrl}api/planes/listar`);
        setPlanes(res.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar los planes", "error");
      } finally {
        setCargando(false);
      }
    };

    fetchPlanes();
  }, []);

  /* ----------------------------
     CARGAR CULQI
  ---------------------------- */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.culqi.com/js/v3";
    script.async = true;
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  /* ----------------------------
     PAGO CULQI
  ---------------------------- */
  const handlePagoCulqi = (plan) => {
    if (!window.Culqi) {
      Swal.fire("Error", "Culqi aún no está listo.", "error");
      return;
    }

    window.Culqi.publicKey = "pk_test_1234567890abcdef0123456789abcdef";

    window.Culqi.settings({
      title: plan.nombre,
      currency: "PEN",
      description: plan.descripcion,
      amount: plan.precio,
      order_id: `plan_${plan.id}_${Date.now()}`,
    });

    window.Culqi.open();

    window.culqi = function () {
      if (window.Culqi.token) {
        Swal.fire(
          "Pago realizado",
          `Tu ${plan.nombre} se activará pronto.`,
          "success"
        );
        window.Culqi.close();
      } else if (window.Culqi.error) {
        Swal.fire("Error", "No se pudo completar el pago", "error");
        window.Culqi.close();
      }
    };
  };

  /* ----------------------------
     UTIL
  ---------------------------- */
  const cortarDescripcion = (html) => {
    if (!html) return "-";
    const texto = html.replace(/<[^>]*>?/gm, "");
    return texto.length > 20 ? texto.substring(0, 20) + "..." : texto;
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

  return (
    <>
      <BreadcrumbALDASA />

      <div className="container py-5">
        <h2 className="text-center mb-5 fw-bold text-success">
          Selecciona un Plan
        </h2>

        {cargando ? (
          <Cargando visible={cargando} />
        ) : (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
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

                          {/*<p title={plan.descripcion}>
                            {cortarDescripcion(plan.descripcion)}
                          </p> */}
                        </div>

                        {/* SHAPE */}
                        <div className="shape-img1 text-center my-3">
                          <img
                            src="/assets/images/favicon-aldasape.png"
                            alt="shape"
                            width="56"
                            height="64"
                          />
                        </div>

                        {/* BENEFICIOS (FIJOS POR AHORA) */}
                        <div
                          className="container"
                          dangerouslySetInnerHTML={{ __html: decodeHTML3(plan.descripcion) }}
                        />

                        {/* BOTÓN */}
                        <div className="pricing-button text-center mt-4">
                          <button
                            className="item-btn"
                            onClick={() => handlePagoCulqi(plan)}
                          >
                            Pagar con Culqi
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Planes;
