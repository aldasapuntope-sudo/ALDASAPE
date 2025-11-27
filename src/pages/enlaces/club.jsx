import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../css/TerminosCondiciones.css";
import Breadcrumb from "../../components/Breadcrumb";
import NotFound from "../../components/NotFound";
import { SkeletonInformacion } from "../../components/TablaSkeleton";
import config from "../../config";

export default function Club() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔗 Endpoint para la sección "Nosotros"
        const res = await axios.get(`${config.apiUrl}api/paginaprincipal/club`);
        setData(res.data[0]); // toma el primer registro del array
      } catch (error) {
        console.error("Error al obtener información de Club:", error);
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

    const decodeHTML2 = (html) => {
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
      <section className="about-wrap2 py-5">
        <Breadcrumb />
        <h2
            className="text-center fw-bold mb-4"
            style={{ color: "var(--green)" }}
        >
              {data.titulo || "Términos y Condiciones"}
        </h2>

        <div className="container" dangerouslySetInnerHTML={{ __html: decodeHTML2(data.contenido) }}>
        
        </div>
      </section>
    </>
  );
}
