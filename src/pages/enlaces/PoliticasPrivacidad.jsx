import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../css/TerminosCondiciones.css";
import Breadcrumb from "../../components/Breadcrumb";
import NotFound from "../../components/NotFound";
import { SkeletonInformacion } from "../../components/TablaSkeleton";

export default function PoliticasPrivacidad() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamada a tu API de Laravel
        const res = await axios.get("http://127.0.0.1:8000/api/paginaprincipal/politicas-privacidad");
        setData(res.data[0]);
      } catch (error) {
        console.error("Error al obtener Políticas de Privacidad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return <SkeletonInformacion />;
  }
  

  if (!data) {
    return (
      <NotFound />
    );
  }

  return (
    <>
      <section className="terminos-wrap py-5">
        <Breadcrumb />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="about-box3 bg-white rounded-4 shadow-sm p-4"
          >
            {/* ✅ Título dinámico */}
            <h2
              className="text-center fw-bold mb-4"
              style={{ color: "var(--green)" }}
            >
              {data.titulo || "Políticas de Privacidad"}
            </h2>

            {/* ✅ Contenido dinámico (HTML desde la base de datos) */}
            <div
              className="contenido-html"
              dangerouslySetInnerHTML={{ __html: data.contenido }}
            ></div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
