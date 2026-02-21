import React, { useEffect, useState, useRef, useMemo } from "react";
import { FaRegSurprise, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Swal from "sweetalert2";
import PropiedadesRow from "./componentes/PropiedadesRow";
import BuscadorAvanzado from "./componentes/BuscadorAvanzado";
import SkeletonBuscarPage from "../TablaSkeleton";

import "../../css/Buscadordetalle.css";
import EmptyState from "../EmptyState";

export default function BuscarPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [resultados, setResultados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Guarda filtros activos
  const filtrosActuales = useRef({});

   // ===== NOMBRES BONITOS =====
  const nombreBonito = (key) => {
    const mapa = {
      q: "Búsqueda",
      tipo: "Tipo de propiedad",
      mode: "Operación",
      ciudad: "Ciudad",
      precioMin: "Precio mínimo",
      precioMax: "Precio máximo",
      dormitorios: "Dormitorios",
      banos: "Baños"
    };
    return mapa[key] || key;
  };

  // ===== GENERAR MENSAJE =====
  const generarMensaje = (params) => {
    let texto = "Hola, estoy buscando una propiedad con las siguientes características:\n\n";
    params.forEach((value, key) => {
      if (!value) return;
      texto += `${nombreBonito(key)}: ${value}\n`;
    });
    return texto;
  };

  // ===== MENSAJE DINAMICO =====
  const paramsMemo = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const mensajeAutomatico = useMemo(() => generarMensaje(paramsMemo), [paramsMemo]);
  // ===== FILTROS ACTIVOS DESDE URL =====
  const filtrosActivos = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const obj = {};

    for (const key of params.keys()) {
      const values = params.getAll(key).filter(v => v && v.trim() !== "");

      if (values.length === 1) {
        obj[key] = values[0];
      } else if (values.length > 1) {
        obj[key] = values;
      }
    }

    return obj;
  }, [location.search]);

  // ===== FORMIK (SIEMPRE ARRIBA) =====
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: "",
      telefono: "",
      correo: "",
      mensaje: mensajeAutomatico
    },
    validationSchema: Yup.object({
      nombre: Yup.string().min(3, "Nombre muy corto").required("El nombre es obligatorio"),
      telefono: Yup.string().min(9, "Teléfono inválido").required("El teléfono es obligatorio"),
      correo: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
      mensaje: Yup.string().min(10, "Mensaje muy corto").required("El mensaje es obligatorio"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setEnviando(true);

        await axios.post(
          `${config.apiUrl}api/paginaprincipal/busqueda-sin-resultados`,
          values
        );

        await Swal.fire({
          icon: "success",
          title: "Solicitud enviada",
          text: "Un asesor te contactará pronto.",
          confirmButtonColor: "#198754",
        });

        resetForm({
          values: {
            nombre: "",
            telefono: "",
            correo: "",
            mensaje: mensajeAutomatico,
          },
        });

      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo enviar la solicitud. Intenta nuevamente.",
          confirmButtonColor: "#dc3545",
        });

      } finally {
        setEnviando(false);
      }
    }
  });

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
  //console.log(resultados.length);

  // 🚫 SIN RESULTADOS
  if (!filtrados.length) {
    
    return (
      <section className="grid-wrap3 py-5">
        <div className="container">
          <div className="row gutters-40">
            <div className="col-lg-4 sidebar-widget mb-4 mb-lg-0">
              <BuscadorAvanzado onFiltrar={manejarFiltro} />
            </div>

            <div className="col-lg-8 d-flex justify-content-center">
              <div className="text-center p-5 rounded-4 shadow-sm bg-light w-100">
              {/*<FaRegSurprise size={80} color="#28a745" className="mb-3" />
                <h4 className="fw-bold text-success">
                  ¡Ups! No encontramos propiedades
                </h4> */}
                <EmptyState
                  image="/assets/images/empty-sinresult.png"
                  title="¡Ups! No encontramos propiedades"
                  description="En este momento no encontramos propiedades. realice un nuevo filtro."
                  
                />

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
            <form onSubmit={formik.handleSubmit} className="mt-4 p-4 bg-white rounded-4 shadow border">
                <h5 className="fw-bold text-success mb-3 text-center">
                  Déjanos tus datos y te ayudamos a encontrar lo que estás buscando
                </h5>

                <div className="row g-3">
                  <div className="col-md-4">
                    <input type="text" name="nombre" className="form-control" placeholder="Nombre" value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.touched.nombre && formik.errors.nombre && (<small className="text-danger">{formik.errors.nombre}</small>)}
                  </div>

                  <div className="col-md-4">
                    <PhoneInput
                      country={"pe"}
                      onlyCountries={["pe","cl","co","mx","ar","us","es"]}
                      value={formik.values.telefono}
                      onChange={(phone) => formik.setFieldValue("telefono", phone)}
                      inputClass="form-control w-100"
                      containerClass="w-100"
                      inputStyle={{ width: "100%", height: "38px" }}
                    />
                    {formik.touched.telefono && formik.errors.telefono && (<small className="text-danger">{formik.errors.telefono}</small>)}
                  </div>

                  <div className="col-md-4">
                    <input type="email" name="correo" className="form-control" placeholder="Correo" value={formik.values.correo} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.touched.correo && formik.errors.correo && (<small className="text-danger">{formik.errors.correo}</small>)}
                  </div>

                  <div className="col-12">
                    <textarea name="mensaje" className="form-control" rows="7" value={formik.values.mensaje} onChange={formik.handleChange} />
                    {formik.touched.mensaje && formik.errors.mensaje && (<small className="text-danger">{formik.errors.mensaje}</small>)}
                  </div>

                  <div className="col-12 text-center">
                    <button type="submit" className="btn btn-success px-5" disabled={enviando}>
                      {enviando ? "Enviando..." : "Solicitar propiedad"}
                    </button>
                  </div>
                </div>
              </form>
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
