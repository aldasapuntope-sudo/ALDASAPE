import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../css/TerminosCondiciones.css";
import Breadcrumb from "../../components/Breadcrumb";
import NotFound from "../../components/NotFound";
import { SkeletonInformacion } from "../../components/TablaSkeleton";

export default function Nosotros() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔗 Endpoint para la sección "Nosotros"
        const res = await axios.get("http://127.0.0.1:8000/api/paginaprincipal/nosotros");
        setData(res.data[0]); // toma el primer registro del array
      } catch (error) {
        console.error("Error al obtener información de Nosotros:", error);
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
    return <NotFound />;
  }

    const decodeHTML = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

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
              {data.titulo || "Nosotros"}
            </h2>

            {/* ✅ Contenido HTML dinámico desde la base de datos */}
            <div
            className="contenido-html"
            dangerouslySetInnerHTML={{ __html: decodeHTML(data.contenido) }}
            ></div>

          </motion.div>
        </div>
      </section>
    </>
  );
}
