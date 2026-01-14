import React, { useEffect, useState, useRef } from "react";
import { FaRegSurprise, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";

import PropiedadesRow from "./componentes/PropiedadesRow";
import BuscadorAvanzado from "./componentes/BuscadorAvanzado";
import SkeletonBuscarPage from "../TablaSkeleton";

import "../../css/Buscadordetalle.css";

export default function BuscarPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [resultados, setResultados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guarda filtros activos
  const filtrosActuales = useRef({});

  // 🔎 OBTENER DATOS DESDE BACKEND
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const q = params.get("q") || "";
    const tipo = params.getAll("tipo"); // ✅ array correcto
    const mode = params.get("mode") || "";

    let cancelado = false;

    const obtenerDatos = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${config.apiUrl}api/paginaprincipal/propiedades/buscar`,
          {
            params: { q, tipo, mode },
          }
        );

        if (cancelado) return;

        const data = res.data?.data || [];
        setResultados(data);
        if (
  filtrosActuales.current &&
  Object.values(filtrosActuales.current).some(
    (v) =>
      (Array.isArray(v) && v.length > 0) ||
      (!Array.isArray(v) && v)
  )
) {
  manejarFiltro(filtrosActuales.current);
} else {
  setFiltrados(data);
}
      } catch (error) {
        if (!cancelado) {
          console.error("❌ Error al obtener propiedades:", error);
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    obtenerDatos();

    return () => {
      cancelado = true;
    };
  }, [location.search]);

  
  // 📍 FILTRADO LOCAL
  const manejarFiltro = (filtros) => {
  filtrosActuales.current = filtros;

  const busq = (filtros.busqueda || "").toLowerCase();
  const ciudadFilter = (filtros.ciudad || "").toLowerCase();
  const modeFilter = (filtros.mode || "").toLowerCase();
  const precioMin =
    typeof filtros.precioMin === "number" ? filtros.precioMin : null;

  const precioMax =
    typeof filtros.precioMax === "number" ? filtros.precioMax : null;


  const tiposFiltro = Array.isArray(filtros.tipos)
    ? filtros.tipos.map((t) => t.toLowerCase())
    : [];

  const filtradosTemp = resultados.filter((prop) => {
    const titulo = (prop.titulo || "").toLowerCase();
    const descripcion = (prop.descripcion || "").toLowerCase();
    const ubicacion = (prop.ubicacion || "").toLowerCase();
    const tipoProp = (prop.tipo_propiedad || "").toLowerCase();
    const operacion = (prop.operaciones || "").toLowerCase();
    const precio = parseFloat(prop.precio) || 0;

    const okBusqueda =
      !busq ||
      titulo.includes(busq) ||
      descripcion.includes(busq) ||
      ubicacion.includes(busq) ||
      tipoProp.includes(busq);

    const okCiudad = !ciudadFilter || ubicacion.includes(ciudadFilter);

    const okPrecio =
      (precioMin === null || precio >= precioMin) &&
      (precioMax === null || precio <= precioMax);

    const okTipo =
      tiposFiltro.length === 0 || tiposFiltro.includes(tipoProp);

    const okOperacion =
    !modeFilter || operacion.toLowerCase() === modeFilter;


    return okBusqueda && okCiudad && okPrecio && okTipo && okOperacion;
  });

  setFiltrados(filtradosTemp);
};





  // 🔁 Reaplicar filtros cuando cambian los resultados
  useEffect(() => {
    if (!resultados.length) return;

    if (
      filtrosActuales.current &&
      Object.values(filtrosActuales.current).some(
        (v) =>
          (Array.isArray(v) && v.length > 0) ||
          (!Array.isArray(v) && v !== "" && v !== null && v !== undefined)
      )

    ) {
      manejarFiltro(filtrosActuales.current);
    } else {
      setFiltrados(resultados);
    }
  }, [resultados]);

  // 🧹 Eliminar filtro desde URL
  const eliminarFiltro = (nombre) => {
    const params = new URLSearchParams(location.search);
    params.delete(nombre);
    navigate(`/buscar?${params.toString()}`);
  };

  // 💀 Skeleton
  if (loading) {
    return <SkeletonBuscarPage />;
  }
  console.log(resultados.length);

  // 🚫 SIN RESULTADOS
  if (!filtrados.length) {
    const params = new URLSearchParams(location.search);
    const filtrosActivos = Object.fromEntries(
      Array.from(params.entries()).filter(([_, v]) => v && v.trim() !== "")
    );

    return (
      <section className="grid-wrap3 py-5">
        <div className="container">
          <div className="row gutters-40">
            <div className="col-lg-4 sidebar-widget mb-4 mb-lg-0">
              <BuscadorAvanzado onFiltrar={manejarFiltro} />
            </div>

            <div className="col-lg-8 d-flex justify-content-center">
              <div className="text-center p-5 rounded-4 shadow-sm bg-light w-100">
                <FaRegSurprise size={80} color="#28a745" className="mb-3" />
                <h4 className="fw-bold text-success">
                  ¡Ups! No encontramos propiedades
                </h4>

                {Object.keys(filtrosActivos).length > 0 && (
                  <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                    {Object.entries(filtrosActivos).map(([key, value]) => (
                      <span
                        key={key}
                        className="badge bg-light text-dark border px-3 py-2 d-flex align-items-center"
                      >
                        <strong className="text-success">{key}:</strong>
                        {value}
                        <FaTimes
                          size={14}
                          className="ms-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => eliminarFiltro(key)}
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

  // ✅ RESULTADOS 
  return (
    <section className="grid-wrap3">
      <div className="container">
        <div className="row gutters-40">
          <div className="col-lg-4 sidebar-widget">
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
