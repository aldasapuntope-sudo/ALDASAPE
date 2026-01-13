import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";

export default function BuscadorAvanzado({
  onFiltrar,
  autoApply = true,
  debounceMs = 500,
}) {
  /* =======================
     ESTADOS
  ======================= */
  const [busqueda, setBusqueda] = useState("");
  const [mode, setMode] = useState(""); // venta | alquiler
  const [ciudad, setCiudad] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  // MULTI
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);

  // DATA
  const [tiposPropiedad, setTiposPropiedad] = useState([]);
  const [tiposOperacion, setTiposOperacion] = useState([]);
  /* =======================
     1. OBTENER TIPOS
  ======================= */
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}api/paginaprincipal/tipos-propiedad`
        );

        if (Array.isArray(res.data?.data)) {
          setTiposPropiedad(res.data.data);
        } else if (Array.isArray(res.data)) {
          setTiposPropiedad(res.data);
        }
      } catch (e) {
        console.error("Error tipos propiedad", e);
      }
    };
    fetchTipos();
  }, []);

  useEffect(() => {
    const fetchOperaciones = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}api/paginaprincipal/tipos-operacion`
        );

        if (Array.isArray(res.data?.data)) {
          setTiposOperacion(res.data.data);
        } else if (Array.isArray(res.data)) {
          setTiposOperacion(res.data);
        }
      } catch (e) {
        console.error("Error tipos operación", e);
      }
    };

    fetchOperaciones();
  }, []);

  /* =======================
     2. LEER URL INICIAL
  ======================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setBusqueda(params.get("q") || "");
    setMode(params.get("mode") || "");
    setCiudad(params.get("ciudad") || "");
    setPrecioMin(params.get("min") || "");
    setPrecioMax(params.get("max") || "");
    setTiposSeleccionados(params.getAll("tipo[]"));

  }, []);

  /* =======================
     HELPERS
  ======================= */
  const construirFiltros = () => ({
    busqueda,
    mode,
    ciudad,
    precioMin: precioMin === "" ? null : Number(precioMin),
    precioMax: precioMax === "" ? null : Number(precioMax),
    tipos: tiposSeleccionados,
  });

  const actualizarURL = (filtros) => {
    const params = new URLSearchParams();

    if (filtros.busqueda) params.set("q", filtros.busqueda);
    if (filtros.mode) params.set("mode", filtros.mode);
    if (filtros.ciudad) params.set("ciudad", filtros.ciudad);
    if (filtros.precioMin !== null) params.set("min", filtros.precioMin);
    if (filtros.precioMax !== null) params.set("max", filtros.precioMax);

    filtros.tipos.forEach((t) => params.append("tipo[]", t));

    window.history.replaceState({}, "", `?${params.toString()}`);
  };

  /* =======================
     AUTO APPLY
  ======================= */
  useEffect(() => {
    if (!autoApply) return;

    const timer = setTimeout(() => {
      const filtros = construirFiltros();
      actualizarURL(filtros);
      onFiltrar && onFiltrar(filtros);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [busqueda, mode, ciudad, precioMin, precioMax, tiposSeleccionados]);

  /* =======================
     CHIPS
  ======================= */
  const agregarTipo = (valor) => {
    if (!tiposSeleccionados.includes(valor)) {
      setTiposSeleccionados([...tiposSeleccionados, valor]);
    }
  };

  const eliminarTipo = (valor) => {
    setTiposSeleccionados(tiposSeleccionados.filter((t) => t !== valor));
  };

  /* =======================
     LIMPIAR
  ======================= */
  const limpiar = () => {
    setBusqueda("");
    setMode("");
    setCiudad("");
    setPrecioMin("");
    setPrecioMax("");
    setTiposSeleccionados([]);
    onFiltrar && onFiltrar({});
    window.history.replaceState({}, "", window.location.pathname);
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="widget widget-advanced-search p-3 border rounded-3 shadow-sm">
      <h3 className="widget-subtitle mb-3">Búsqueda Avanzada</h3>

      {/* BUSQUEDA */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="¿Qué estás buscando?"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* TIPOS */}
      <select
        className="form-select mb-2"
        onChange={(e) => agregarTipo(e.target.value)}
        value=""
      >
        <option value="">Agregar tipo de propiedad</option>
        {tiposPropiedad.map((t) => (
          <option key={t.id} value={t.nombre}>
            {t.nombre}
          </option>
        ))}
      </select>

      {/* CHIPS */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {tiposSeleccionados.map((t) => (
          <span
            key={t}
            className="badge bg-success d-flex align-items-center gap-1"
          >
            {t}
            <FaTimes
              style={{ cursor: "pointer" }}
              onClick={() => eliminarTipo(t)}
            />
          </span>
        ))}
      </div>

      {/* OPERACIÓN */}
      <select
      className="form-select mb-3"
      value={mode}
      onChange={(e) => setMode(e.target.value)}
    >
      <option value="">Operación</option>

      {tiposOperacion.map((op) => (
        <option
          key={op.id ?? op.slug ?? op.nombre}
          value={op.slug ?? op.nombre.toLowerCase()}
        >
          {op.nombre}
        </option>
      ))}
    </select>

      {/* CIUDAD */}
      <select
        className="form-select mb-3"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
      >
        <option value="">Ubicación</option>
        <option value="Chiclayo">Chiclayo</option>
        <option value="Lambayeque">Lambayeque</option>
        <option value="Pimentel">Pimentel</option>
      </select>

      {/* PRECIOS */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Mín"
          value={precioMin}
          onChange={(e) => setPrecioMin(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Máx"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
        />
      </div>

      {/* BOTONES */}
      <div className="d-flex gap-2">
        <button className="btn btn-success w-100">
          Buscar <FaSearch />
        </button>
        <button className="btn btn-outline-secondary" onClick={limpiar}>
          Limpiar
        </button>
      </div>
    </div>
  );
}
