import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";

export default function SearchFilter({ mode, setMode }) {
  const [tipos, setTipos] = useState([]);
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
        if (Array.isArray(res.data)) setTipos(res.data);
        else if (res.data.data) setTipos(res.data.data);
      })
      .catch((err) => console.error(err));
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
          )}&tipo=${tipo}`
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
        .catch((err) => console.error(err));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [q, tipo]);

  // 🔹 Enviar búsqueda
  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (tipo) params.append("tipo", tipo);
    params.append("mode", mode); // alquilar, comprar o proyectos

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
      {/* Tabs */}
      <div className="search-tabs mb-2">
        {["alquilar", "comprar", "proyectos"].map((item) => (
          <button
            key={item}
            className={`tab-btn ${mode === item ? "active" : ""}`}
            onClick={() => setMode(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {/* Formulario */}
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
            disabled={!tipo} // ⚠️ Deshabilitado si no elige tipo
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
          disabled={!tipo} // ⚠️ Deshabilitado si no elige tipo
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
