import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../css/TerminosCondiciones.css";
import Breadcrumb from "../../components/Breadcrumb";
import NotFound from "../../components/NotFound";
import { SkeletonInformacion } from "../../components/TablaSkeleton";
import { useUsuario } from "../../context/UserContext"; // 👈 IMPORTANTE
import config from "../../config";
import BreadcrumbALDASA from "../../cuerpos_dashboard/BreadcrumbAldasa";

export default function Club() {
  const { usuario } = useUsuario();   // 👈 DETECTA SI HAY USUARIO
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // -----------------------------------------------------
  // BOTÓN DINÁMICO SEGÚN SI EXISTE USUARIO
  // -----------------------------------------------------
  const botonPlan = (
    <div className="pricing-button">
      {!usuario ? (
        <a href="/registro" className="item-btn">Registrarse</a>
      ) : (
        <button className="item-btn" onClick={() => alert("Pagar con Culqi")}>
          Pagar con Culqi
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="container  mt-4">
        {usuario ? <BreadcrumbALDASA /> : <Breadcrumb />}
      </div>
      

      
      <section className="about-wrap2 rounded-4 py-5 mt-5" style={{background: 'white'}}>
        <h2 className="text-center fw-bold mb-4" style={{ color: "var(--green)" }}>
          {data.titulo || "Términos y Condiciones"}
        </h2>

        <div className="container" dangerouslySetInnerHTML={{ __html: decodeHTML2(data.contenido) }} />
      </section>

      {/* PLANES DE PRECIOS */}
      <section className="pricing-wrap1 rounded-4 mt-4" style={{background: 'white'}}>
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
                  <img src="/assets/images/favicon-aldasape.png" alt="ALDASA Logo" style={{ height: 50, width: 50 }} />
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

                {/* ✔️ BOTÓN DINÁMICO */}
                {botonPlan}
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
                  <img src="/assets/images/favicon-aldasape.png" alt="ALDASA Logo" style={{ height: 50, width: 50 }} />
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

                {/* ✔️ BOTÓN DINÁMICO */}
                {botonPlan}
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
                  <img src="/assets/images/favicon-aldasape.png" alt="ALDASA Logo" style={{ height: 50, width: 50 }} />
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

                {/* ✔️ BOTÓN DINÁMICO */}
                {botonPlan}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
