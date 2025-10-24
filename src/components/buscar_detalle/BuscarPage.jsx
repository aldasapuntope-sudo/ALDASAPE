import React, { useEffect, useState, useRef } from "react";
import { FaRegSurprise } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import PropiedadesRow from "./componentes/PropiedadesRow";
import BuscadorAvanzado from "./componentes/BuscadorAvanzado";
import "../../css/Buscadordetalle.css";
import SkeletonBuscarPage from "../TablaSkeleton";

export default function BuscarPage() {
  const location = useLocation();
  const [resultados, setResultados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const filtrosActuales = useRef({});

  // 🔎 Efecto principal: obtener datos desde el backend
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log(params);
    const q = params.get("q") || "";
    const tipo = params.get("tipo") || "";
    const mode = params.get("mode") || "";

    console.log("🔍 Parámetros enviados:", { q, tipo, mode });

    let cancelado = false;

    const obtenerDatos = async () => {
      try {
        setLoading(true);
        console.log("⚙️ Solicitando datos al backend...");
        const res = await axios.get(
          `${config.apiUrl}api/paginaprincipal/propiedades/buscar?q=${q}&tipo=${tipo}&mode=${mode}`
        );
        if (cancelado) return;

        console.log(`${config.apiUrl}api/paginaprincipal/propiedades/buscar?q=${q}&tipo=${tipo}&mode=${mode}`);
        const data = res.data?.data || [];
        console.log(`📦 Respuesta backend (${data.length} items):`, data);

        setResultados(data);
        setFiltrados(data);
      } catch (error) {
        if (!cancelado) console.error("❌ Error al obtener propiedades:", error);
      } finally {
        if (!cancelado) {
          setLoading(false);
          console.log("✅ Carga finalizada, loading = false");
        }
      }
    };

    obtenerDatos();

    return () => {
      cancelado = true;
    };
  }, [location.search]);

  // 📍 Filtrado local
  const manejarFiltro = (filtros) => {
    filtrosActuales.current = filtros;
    const busq = (filtros.busqueda || "").toLowerCase();
    const tipoFilter = (filtros.tipo || "").toLowerCase();
    const categoriaFilter = (filtros.categoria || "").toLowerCase();
    const ciudadFilter = (filtros.ciudad || "").toLowerCase();
    const precioMin = filtros.precioMin ?? null;
    const precioMax = filtros.precioMax ?? null;

    const filtradosTemp = resultados.filter((prop) => {
      const titulo = (prop.titulo || "").toLowerCase();
      const descripcion = (prop.descripcion || "").toLowerCase();
      const ubicacion = (prop.ubicacion || "").toLowerCase();
      const tipoProp = (prop.tipo_propiedad || "").toLowerCase();
      const operacion = (prop.operaciones || prop.operacion || "").toLowerCase();
      const precio = parseFloat(prop.precio) || 0;

      const okBusqueda =
        !busq ||
        titulo.includes(busq) ||
        descripcion.includes(busq) ||
        tipoProp.includes(busq) ||
        ubicacion.includes(busq) ||
        operacion.includes(busq);

      const okTipo = !tipoFilter || tipoProp === tipoFilter;
      const okCategoria = !categoriaFilter || operacion === categoriaFilter;
      const okCiudad = !ciudadFilter || ubicacion.includes(ciudadFilter);
      const okPrecio =
        (precioMin === null || precio >= precioMin) &&
        (precioMax === null || precio <= precioMax);

      return okBusqueda && okTipo && okCategoria && okCiudad && okPrecio;
    });

    console.log(`🧩 Filtrado aplicado: ${filtradosTemp.length} resultados`);
    setFiltrados(filtradosTemp);
  };

  // 🔁 Reaplicar filtros cuando cambian los resultados
  useEffect(() => {
    if (resultados.length > 0) {
      if (Object.keys(filtrosActuales.current).length > 0) {
        manejarFiltro(filtrosActuales.current);
      } else {
        setFiltrados(resultados);
      }
    }
  }, [resultados]);

  // 💀 Si está cargando, muestra skeleton
  if (loading) {
    console.log("⏳ Mostrando SkeletonBuscarPage...");
    return <SkeletonBuscarPage />;
  }

  // 📦 Mostrar resultados
  console.log("🎯 Resultados filtrados:", filtrados);

  if (!filtrados.length) {
    return (
      <section className="grid-wrap3 py-5">
        <div className="container">
          <div className="row gutters-40">
            <div className="col-lg-4 widget-break-lg sidebar-widget mb-4 mb-lg-0">
              <BuscadorAvanzado onFiltrar={manejarFiltro} />
            </div>
            <div className="col-lg-8 d-flex flex-column text-center">
              <div
                className="d-flex flex-column align-items-center justify-content-center p-5 rounded-4 shadow-sm bg-light"
                style={{ minHeight: "320px" }}
              >
                <FaRegSurprise
                  size={80}
                  color="#28a745"
                  className="mb-3 animate__animated animate__bounceIn"
                />
                <h4 className="fw-bold mb-2 text-success">
                  ¡Ups! No encontramos propiedades
                </h4>
                <p className="text-muted mb-0">
                  Intenta ajustar los filtros o busca en otra ubicación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid-wrap3">
      <div className="container">
        <div className="row gutters-40">
          <div className="col-lg-4 widget-break-lg sidebar-widget">
            <BuscadorAvanzado onFiltrar={manejarFiltro} />
          </div>

          <div className="col-lg-8">
            <PropiedadesRow resultados={filtrados} />
          </div>
        </div>
      </div>
    </section>
  );
}
