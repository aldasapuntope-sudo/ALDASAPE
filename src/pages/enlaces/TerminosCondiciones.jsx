import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../css/TerminosCondiciones.css";
import Breadcrumb from "../../components/Breadcrumb";

export default function TerminosCondiciones() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔗 Endpoint dinámico desde Laravel
        const res = await axios.get("http://127.0.0.1:8000/api/paginaprincipal/terminos-condiciones");
        setData(res.data[0]); // tomamos el primer registro
      } catch (error) {
        console.error("Error al obtener Términos y Condiciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="terminos-wrap py-5 text-center">
        <p className="text-muted fw-semibold">Cargando contenido...</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="terminos-wrap py-5 text-center">
        <p className="text-danger fw-semibold">No se encontró la información.</p>
      </section>
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
              {data.titulo || "Términos y Condiciones"}
            </h2>

            {/* ✅ Contenido con formato HTML desde base de datos */}
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
