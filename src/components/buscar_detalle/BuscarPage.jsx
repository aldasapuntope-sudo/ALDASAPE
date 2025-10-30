import React, { useEffect, useState, useRef } from "react";
import { FaRegSurprise, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import PropiedadesRow from "./componentes/PropiedadesRow";
import BuscadorAvanzado from "./componentes/BuscadorAvanzado";
import "../../css/Buscadordetalle.css";
import SkeletonBuscarPage from "../TablaSkeleton";

export default function BuscarPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultados, setResultados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const filtrosActuales = useRef({});

  // 🔎 Efecto principal: obtener propiedades desde el backend
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const tipo = params.get("tipo") || "";
    const mode = params.get("mode") || "";

    let cancelado = false;

    const obtenerDatos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${config.apiUrl}api/paginaprincipal/propiedades/buscar?q=${q}&tipo=${tipo}&mode=${mode}`
        );
        if (cancelado) return;

        const data = res.data?.data || [];
        setResultados(data);
        setFiltrados(data);
      } catch (error) {
        if (!cancelado) console.error("❌ Error al obtener propiedades:", error);
      } finally {
        if (!cancelado) setLoading(false);
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
    const categoriaFilter = (filtros.categoria || "").toLowerCase();
    const ciudadFilter = (filtros.ciudad || "").toLowerCase();
    const precioMin = filtros.precioMin ?? null;
    const precioMax = filtros.precioMax ?? null;

    const filtradosTemp = resultados.filter((prop) => {
      const titulo = (prop.titulo || "").toLowerCase();
      const descripcion = (prop.descripcion || "").toLowerCase();
      const ubicacion = (prop.ubicacion || "").toLowerCase();
      const operacion = (prop.operaciones || prop.operacion || "").toLowerCase();
      const precio = parseFloat(prop.precio) || 0;

      const tipoFilter = filtros.tipo?.toString().toLowerCase() || "";
      const tipoPropId = prop.id_tipopropiedad?.toString().toLowerCase() || "";
      const tipoProp = (prop.tipo_propiedad || "").toLowerCase();

      const okTipo =
        !tipoFilter ||
        tipoPropId === tipoFilter ||
        tipoProp === tipoFilter;
      const okBusqueda =
        !busq ||
        titulo.includes(busq) ||
        descripcion.includes(busq) ||
        tipoProp.includes(busq) ||
        ubicacion.includes(busq) ||
        operacion.includes(busq);
      const okCategoria = !categoriaFilter || operacion === categoriaFilter;
      const okCiudad = !ciudadFilter || ubicacion.includes(ciudadFilter);
      const okPrecio =
        (precioMin === null || precio >= precioMin) &&
        (precioMax === null || precio <= precioMax);

      return okBusqueda && okTipo && okCategoria && okCiudad && okPrecio;
    });

    setFiltrados(filtradosTemp);
  };

  // 🔁 Reaplicar filtros al cambiar resultados
  useEffect(() => {
    if (resultados.length > 0) {
      if (Object.keys(filtrosActuales.current).length > 0) {
        manejarFiltro(filtrosActuales.current);
      } else {
        setFiltrados(resultados);
      }
    }
  }, [resultados]);

  // 🧹 Eliminar un filtro individualmente
  const eliminarFiltro = (nombre) => {
    const params = new URLSearchParams(location.search);
    params.delete(nombre);
    navigate(`/buscar?${params.toString()}`);
  };

  // 💀 Mostrar skeleton si está cargando
  if (loading) return <SkeletonBuscarPage />;

  // 🧩 Mostrar mensaje si no hay resultados
  if (!filtrados.length) {
    const params = new URLSearchParams(location.search);
    const filtrosActivos = Object.fromEntries(
      Array.from(params.entries()).filter(([_, v]) => v && v.trim() !== "")
    );

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
                <p className="text-muted mb-3">
                  Intenta ajustar los filtros o busca en otra ubicación.
                </p>

                {/* 🏷️ Filtros activos */}
                {Object.keys(filtrosActivos).length > 0 && (
                  <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                    {Object.entries(filtrosActivos).map(([key, value]) => (
                      <span
                        key={key}
                        className="badge bg-light text-dark border px-3 py-2 d-flex align-items-center"
                        style={{
                          borderRadius: "20px",
                          gap: "6px",
                          fontSize: "15px",
                        }}
                      >
                        <strong className="text-success">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>{" "}
                        {value}
                        <FaTimes
                          onClick={() => eliminarFiltro(key)}
                          className="ms-2 cursor-pointer"
                          size={14}
                          color="#dc3545"
                          style={{ cursor: "pointer" }}
                          title="Eliminar filtro"
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Mostrar resultados normales
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
