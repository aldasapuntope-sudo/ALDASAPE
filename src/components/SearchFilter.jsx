import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

export default function SearchFilter({ mode, setMode }) {
  const [tipos, setTipos] = useState([]);
  const [operaciones, setOperaciones] = useState([]); // 🔹 NUEVO estado
  const [tipo, setTipo] = useState("");
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 🔹 Cargar tipos de propiedad
  useEffect(() => {
    axios
      .get(`${config.apiUrl}api/paginaprincipal/tipos-propiedad`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setTipos(data || []);
      })
      .catch((err) => console.error("Error al cargar tipos de propiedad:", err));
  }, []);

  // 🔹 Cargar tipos de operación (alquilar, comprar, proyectos)
  useEffect(() => {
    axios
      .get(`${config.apiUrl}api/paginaprincipal/tipos-operacion`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setOperaciones(data || []);
        // Si no hay modo seleccionado, usar el primero de la lista
        if (!mode && data.length > 0) setMode(data[0].nombre.toLowerCase());
      })
      .catch((err) => console.error("Error al cargar tipos de operación:", err));
  }, []);

  // 🔍 Buscar propiedades (considera tipo + texto)
  useEffect(() => {
    if (q.length < 2 || !tipo) {
      setResultados([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get(
          `${config.apiUrl}api/paginaprincipal/propiedades/buscar?q=${encodeURIComponent(
            q
          )}&tipo=${tipo}&mode=${mode}`
        )
        .then((res) => {
          if (res.data && Array.isArray(res.data.data)) {
            setResultados(res.data.data);
            setShowDropdown(true);
          } else {
            setResultados([]);
            setShowDropdown(false);
          }
        })
        .catch((err) => console.error("Error al buscar propiedades:", err));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [q, tipo, mode]);

  // 🔹 Enviar búsqueda
  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (tipo) params.append("tipo", tipo);
    if (mode) params.append("mode", mode);

    navigate(`/buscar?${params.toString()}`);
    setShowDropdown(false);
  };

  // 🔹 Seleccionar sugerencia
  const handleSelectSuggestion = (item) => {
    navigate(
      `/anuncio/${item.id}-${item.titulo
        .replace(/\s+/g, "-")
        .toLowerCase()}`
    );
    setShowDropdown(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Tabs dinámicos de tipos de operación */}
      <div className="search-tabs mb-2">
        {operaciones.map((item) => (
          <button
            key={item.id}
            className={`tab-btn ${mode === item.nombre.toLowerCase() ? "active" : ""}`}
            onClick={() => setMode(item.nombre.toLowerCase())}
          >
            {item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}
          </button>
        ))}
      </div>

      {/* Formulario de búsqueda */}
      <form className="search-box" onSubmit={handleSubmit}>
        <select
          className="form-select"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="">Seleccione tipo</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre.charAt(0).toUpperCase() + t.nombre.slice(1)}
            </option>
          ))}
        </select>

        <div style={{ position: "relative", flexGrow: 1 }}>
          <input
            className="form-control"
            placeholder="Ej: Chiclayo, Pomalca, Piscina..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => resultados.length && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            disabled={!tipo}
          />

          {/* Dropdown de sugerencias */}
          {showDropdown && resultados.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "0px 0px 8px 8px",
                maxHeight: "250px",
                overflowY: "auto",
                zIndex: 1000,
                listStyle: "none",
                padding: 0,
                marginTop: 4,
                color: "black",
                textAlign: "left",
              }}
            >
              {resultados.map((item) => (
                <li
                  key={item.id}
                  onMouseDown={() => handleSelectSuggestion(item)}
                  style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8f8f8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  {item.titulo
                    ? item.titulo.charAt(0).toUpperCase() +
                      item.titulo.slice(1).toLowerCase()
                    : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="btn btn-green"
          type="submit"
          disabled={!tipo}
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
