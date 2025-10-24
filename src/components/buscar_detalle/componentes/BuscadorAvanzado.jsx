import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios"; // ✅ Asegúrate de que apunte a tu backend baseURL
import config from "../../../config";

export default function BuscadorAvanzado({
  onFiltrar,
  autoApply = true,
  debounceMs = 500,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const [tiposPropiedad, setTiposPropiedad] = useState([]); // 🏠 lista desde la API

  // ✅ 1. Obtener tipos de propiedad desde la API
  useEffect(() => {
  const fetchTipos = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}api/paginaprincipal/tipos-propiedad`);

      // Si viene como { success: true, data: [...] }
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setTiposPropiedad(res.data.data);
      }
      // Si viene directamente como un array [...]
      else if (Array.isArray(res.data)) {
        setTiposPropiedad(res.data);
      }
      else {
        console.warn("⚠️ Formato inesperado en tipos de propiedad:", res.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener tipos de propiedad:", error);
    }
  };
  fetchTipos();
}, []);


  // ✅ 2. Leer filtros desde la URL una sola vez
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    const tipoParam = params.get("tipo") || "";
    const mode = params.get("mode") || "";
    const ciudadParam = params.get("ciudad") || "";
    const min = params.get("min") || "";
    const max = params.get("max") || "";

    setBusqueda(q);
    setTipo(tipoParam.toLowerCase());
    setCategoria(mode.toLowerCase());
    setCiudad(ciudadParam);
    setPrecioMin(min);
    setPrecioMax(max);

    // Aplica los filtros iniciales
    onFiltrar &&
      onFiltrar({
        busqueda: q,
        tipo: tipoParam.toLowerCase(),
        categoria: mode.toLowerCase(),
        ciudad: ciudadParam,
        precioMin: min ? Number(min) : null,
        precioMax: max ? Number(max) : null,
      });
  }, []);

  // ✅ 3. Construir objeto de filtros actual
  const construirFiltros = () => ({
    busqueda: (busqueda || "").trim(),
    tipo: (tipo || "").trim(),
    categoria: (categoria || "").trim(),
    ciudad: (ciudad || "").trim(),
    precioMin: precioMin === "" ? null : Number(precioMin),
    precioMax: precioMax === "" ? null : Number(precioMax),
  });

  // ✅ 4. Actualizar la URL cuando cambian los filtros
  const actualizarURL = (filtros) => {
    const params = new URLSearchParams();

    if (filtros.busqueda) params.set("q", filtros.busqueda);
    if (filtros.tipo) params.set("tipo", filtros.tipo);
    if (filtros.categoria) params.set("mode", filtros.categoria);
    if (filtros.ciudad) params.set("ciudad", filtros.ciudad);
    if (filtros.precioMin !== null) params.set("min", filtros.precioMin);
    if (filtros.precioMax !== null) params.set("max", filtros.precioMax);

    const nuevaURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", nuevaURL);
  };

  // ✅ 5. Aplicar filtros automáticamente (con debounce)
  useEffect(() => {
    if (!autoApply) return;
    const timeout = setTimeout(() => {
      const filtros = construirFiltros();
      actualizarURL(filtros);
      onFiltrar && onFiltrar(filtros);
    }, debounceMs);
    return () => clearTimeout(timeout);
  }, [busqueda, tipo, categoria, ciudad, precioMin, precioMax]);

  // ✅ 6. Aplicar filtros manualmente (botón “Aplicar”)
  const manejarSubmit = (e) => {
    e.preventDefault();
    const filtros = construirFiltros();
    actualizarURL(filtros);
    onFiltrar && onFiltrar(filtros);
  };

  // ✅ 7. Limpiar filtros y URL
  const limpiar = () => {
    setBusqueda("");
    setTipo("");
    setCategoria("");
    setCiudad("");
    setPrecioMin("");
    setPrecioMax("");
    const filtrosVacios = {
      busqueda: "",
      tipo: "",
      categoria: "",
      ciudad: "",
      precioMin: null,
      precioMax: null,
    };
    onFiltrar && onFiltrar(filtrosVacios);
    window.history.replaceState({}, "", window.location.pathname);
  };

  // ✅ 8. Interfaz
  return (
    <div className="widget widget-advanced-search p-3 border rounded-3 shadow-sm">
      <h3 className="widget-subtitle mb-3">Búsqueda Avanzada</h3>

      <form onSubmit={manejarSubmit} className="map-forms map-form-style-2">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="¿Qué estás buscando? (ej. casa, departamento, piscina...)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="row">
          {/* 🔸 Tipo de Propiedad dinámico */}
          <div className="col-lg-12 mb-3">
            <select
              className="form-select"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Tipo de Propiedad</option>
              {tiposPropiedad.length > 0 ? (
                tiposPropiedad.map((t) => (
                  <option key={t.id} value={t.nombre.toLowerCase()}>
                    {t.nombre}
                  </option>
                ))
              ) : (
                <option disabled>Cargando tipos...</option>
              )}
            </select>
          </div>

          {/* Operación */}
          <div className="col-lg-12 mb-3">
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Operación</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          {/* Ciudad */}
          <div className="col-lg-12 mb-3">
            <select
              className="form-select"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            >
              <option value="">Ubicación</option>
              <option value="Chiclayo">Chiclayo</option>
              <option value="Lambayeque">Lambayeque</option>
              <option value="Pimentel">Pimentel</option>
            </select>
          </div>
        </div>

        {/* Rango de precios */}
        <div className="mt-2">
          <label className="fw-bold d-block mb-1">Rango de Precio (S/)</label>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Mín"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Máx"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-success w-100">
            Aplicar <FaSearch className="ms-1" />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={limpiar}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
