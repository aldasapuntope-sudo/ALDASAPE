import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
import { useUsuario } from "../../../context/UserContext";

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
  const { usuario } = useUsuario();

  // MULTI
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);

  // DATA
  const [tiposPropiedad, setTiposPropiedad] = useState([]);
  const [tiposOperacion, setTiposOperacion] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
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

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}api/paginaprincipal/tipos-ubicaciones`
        );

        if (Array.isArray(res.data?.data)) {
          setUbicaciones(res.data.data);
        } else if (Array.isArray(res.data)) {
          setUbicaciones(res.data);
        }
      } catch (e) {
        console.error("Error ubicaciones", e);
      }
    };

    fetchUbicaciones();
  }, []);

  const generarTitulo = (filtros) => {
    let partes = [];

    if (filtros.tipos.length) {
      partes.push(filtros.tipos.join(", "));
    }

    if (filtros.mode) {
      partes.push(filtros.mode === "alquiler" ? "en Alquiler" : "en Venta");
    }

    if (filtros.ciudad) {
      partes.push(`- ${filtros.ciudad}`);
    }

    return partes.length ? partes.join(" ") : "Búsqueda personalizada";
  };



  const guardarFiltro = async () => {
  // 🔐 VALIDAR SESIÓN
  if (!usuario || !usuario.usuarioaldasa || !usuario.usuarioaldasa.id) {
    Swal.fire({
      icon: "warning",
      title: "Inicia sesión",
      text: "Debes iniciar sesión para guardar una búsqueda",
      confirmButtonText: "Entendido",
    });
    return;
  }

  const filtros = construirFiltros();

  // 🚫 VALIDACIÓN DE FILTROS
  if (
    !filtros.tipos.length &&
    !filtros.mode &&
    !filtros.ciudad &&
    !filtros.busqueda
  ) {
    Swal.fire({
      icon: "info",
      title: "Filtros vacíos",
      text: "Debes seleccionar al menos un filtro para guardar la búsqueda",
      confirmButtonText: "Ok",
    });
    return;
  }

  const params = new URLSearchParams();

  if (filtros.busqueda) params.set("q", filtros.busqueda);
  if (filtros.mode) params.set("mode", filtros.mode);
  if (filtros.ciudad) params.set("ciudad", filtros.ciudad);
  if (filtros.precioMin !== null) params.set("min", filtros.precioMin);
  if (filtros.precioMax !== null) params.set("max", filtros.precioMax);

  filtros.tipos.forEach((t) => params.append("tipo[]", t));

  const urlFiltro = `/buscar?${params.toString()}`;
  const titulo = generarTitulo(filtros);

  try {
    await axios.post(`${config.apiUrl}api/administracion/busquedas-guardadas`, {
      titulo,
      url_filtro: urlFiltro,
      alerta: "inmediata",
      usuario_id: usuario.usuarioaldasa.id, // 👈 importante
    });

    Swal.fire({
      icon: "success",
      title: "Búsqueda guardada",
      text: "Tu búsqueda se guardó correctamente",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo guardar la búsqueda",
    });
  }
};






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

        {ubicaciones.map((u) => (
          <option
            key={u.id ?? u.slug ?? u.nombre}
            value={u.slug ?? u.nombre}
          >
            {u.nombre}
          </option>
        ))}
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
        <button
          className="btn btn-primary w-100"
          onClick={guardarFiltro}
        >
          Guardar búsqueda
        </button>
        <button className="btn btn-outline-secondary" onClick={limpiar}>
          Limpiar
        </button>
      </div>
    </div>
  );
}
