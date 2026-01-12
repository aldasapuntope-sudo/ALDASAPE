import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { SkeletonTabs } from "./TablaSkeleton";

export default function SearchFilter({ mode, setMode }) {
  const navigate = useNavigate();

  const [tipos, setTipos] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  const [tipo, setTipo] = useState("");
  const [q, setQ] = useState("");
  const [chips, setChips] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingTabs, setLoadingTabs] = useState(true);

  /* =========================
     CARGAR TIPOS
  ========================= */

  useEffect(() => {
    axios
      .get(`${config.apiUrl}api/paginaprincipal/tipos-propiedad`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setTipos(data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}api/paginaprincipal/tipos-operacion`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setOperaciones(data || []);
        setLoadingTabs(false);

        if (!mode && data?.length) {
          setMode(data[0].nombre.toLowerCase());
        }
      })
      .catch(() => setLoadingTabs(false));
  }, []);

  /* =========================
     AUTOCOMPLETE
  ========================= */

  useEffect(() => {
    if (q.length < 2 || !tipo) {
      setResultados([]);
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(() => {
      axios
        .get(
          `${config.apiUrl}api/paginaprincipal/propiedades/buscar?q=${encodeURIComponent(
            q
          )}&tipo=${tipo}&mode=${mode}`
        )
        .then((res) => {
          if (Array.isArray(res.data?.data)) {
            setResultados(res.data.data);
            setShowDropdown(true);
          }
        })
        .catch(console.error);
    }, 350);

    return () => clearTimeout(delay);
  }, [q, tipo, mode]);

  /* =========================
     CHIPS
  ========================= */

  const handleSelectSuggestion = (item) => {
    const value = item.titulo?.trim();
    if (!value) return;

    setChips((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );

    setQ("");
    setShowDropdown(false);
  };

  const removeChip = (chip) => {
    setChips((prev) => prev.filter((c) => c !== chip));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (chips.length) params.append("q", chips.join(","));
    if (tipo) params.append("tipo", tipo);
    if (mode) params.append("mode", mode);

    navigate(`/buscar?${params.toString()}`);
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div style={{ position: "relative" }}>
      {/* TABS */}
      <div className="search-tabs mb-2">
        {loadingTabs ? (
          <SkeletonTabs />
        ) : (
          operaciones.map((op) => (
            <button
              key={op.id}
              className={`tab-btn ${
                mode === op.nombre.toLowerCase() ? "active" : ""
              }`}
              onClick={() => setMode(op.nombre.toLowerCase())}
            >
              {op.nombre}
            </button>
          ))
        )}
      </div>

      {/* FORM */}
      <form className="search-box" onSubmit={handleSubmit}>
        {/* TIPO */}
        <select
          className="form-select"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{ width: 170 }}
        >
          <option value="">Seleccione tipo</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.nombre}>
              {t.nombre}
            </option>
          ))}
        </select>

        {/* INPUT + CHIPS */}
        <div style={{ position: "relative", flexGrow: 1 }}>
          <div
            className="form-control d-flex flex-wrap align-items-center gap-2"
            style={{ minHeight: 46 }}
            onClick={() =>
              document.getElementById("chip-input")?.focus()
            }
          >
            {chips.map((chip, i) => (
              <span
                key={i}
                style={{
                  background: "#e8f5e9",
                  color: "#1b5e20",
                  padding: "5px 10px",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
                {chip}
                <span
                  onClick={() => removeChip(chip)}
                  style={{
                    marginLeft: 8,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </span>
              </span>
            ))}

            <input
              id="chip-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                chips.length
                  ? "Agregar otro filtro..."
                  : "Ingresa ubicaciones o características"
              }
              disabled={!tipo}
              style={{
                border: "none",
                outline: "none",
                flexGrow: 1,
                minWidth: 160,
              }}
            />
          </div>

          {/* DROPDOWN */}
          {showDropdown && resultados.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                color: "black",
                border: "1px solid #ddd",
                borderRadius: "0 0 8px 8px",
                maxHeight: 250,
                overflowY: "auto",
                zIndex: 1000,
                listStyle: "none",
                padding: 0,
                marginTop: 4,
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
                >
                  {item.titulo}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* BOTÓN */}
        {tipo && (
          <button className="btn btn-green" type="submit">
            Buscar
          </button>
        )}
      </form>
    </div>
  );
}
