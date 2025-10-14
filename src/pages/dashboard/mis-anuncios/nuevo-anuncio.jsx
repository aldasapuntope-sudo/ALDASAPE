import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import config from "../../../config";
import { useUsuario } from "../../../context/UserContext";
import Cargando from "../../../components/cargando";
import axios from "axios";

const NuevoAnuncio = ({ anuncio = null, onClose, onRefresh }) => {
  const [tipos, setTipos] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState({});
  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);
  const { usuario } = useUsuario();

  // 🧩 Formik
  const formik = useFormik({
    initialValues: {
      tipo_id: anuncio?.tipo_id || "",
      operacion_id: anuncio?.operacion_id || "",
      ubicacion_id: anuncio?.ubicacion_id || "",
      titulo: anuncio?.titulo || "",
      descripcion: anuncio?.descripcion || "",
      precio: anuncio?.precio || "",
      imagen_principal: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      tipo_id: Yup.string().required("Seleccione un tipo de propiedad"),
      operacion_id: Yup.string().required("Seleccione un tipo de operación"),
      ubicacion_id: Yup.string().required("Seleccione una ubicación"),
      titulo: Yup.string().required("El título es obligatorio"),
      descripcion: Yup.string().required("La descripción es obligatoria"),
      precio: Yup.number()
        .typeError("Debe ser un número")
        .positive("Debe ser mayor a 0")
        .required("El precio es obligatorio"),
    }),
    onSubmit: async (values) => {
      setCargando(true);
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        formData.append("user_id", usuario?.usuarioaldasa?.id);

        // Características seleccionadas con valores
        const seleccionadas = Object.entries(caracteristicasSeleccionadas)
          .filter(([_, data]) => data.checked)
          .map(([id, data]) => ({
            id: parseInt(id),
            valor: data.valor || "",
          }));

        if (seleccionadas.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debes seleccionar al menos una característica",
          });
          setCargando(false);
          return;
        }

        formData.append("caracteristicas", JSON.stringify(seleccionadas));

        const url = anuncio
          ? `${config.apiUrl}api/misanuncios/actualizar/${anuncio.id}`
          : `${config.apiUrl}api/misanuncios/registrar`;

        if (anuncio) formData.append("_method", "PUT");

        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("📦 Respuesta:", data);

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: anuncio ? "Anuncio actualizado" : "Anuncio publicado",
            text: anuncio
              ? "Los cambios han sido guardados correctamente."
              : "Tu propiedad ha sido publicada exitosamente.",
          });
          formik.resetForm();
          setImagen(null);
          setCaracteristicasSeleccionadas({});
          onClose?.();
          onRefresh?.();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "No se pudo guardar el anuncio",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor",
        });
        console.error(error);
      } finally {
        setCargando(false);
      }
    },
  });

  // 🧩 Cargar combos al iniciar
  useEffect(() => {
    cargarCombos();
  }, []);

  // 🧩 Cargar selección de características según el anuncio
  useEffect(() => {
    if (caracteristicas.length && anuncio?.caracteristicas) {
      const seleccionadas = {};
      caracteristicas.forEach((c) => {
        seleccionadas[c.id] = {
          checked: anuncio.caracteristicas.some(ac => ac.id === c.id),
          valor: anuncio.caracteristicas.find(ac => ac.id === c.id)?.valor || "",
        };
      });
      setCaracteristicasSeleccionadas(seleccionadas);
    }
  }, [caracteristicas, anuncio]);

  async function cargarCombos() {
    setCargando(true);
    try {
      const [resTipos, resOps, resUbic, resCarac] = await Promise.all([
        axios.get(`${config.apiUrl}api/misanuncios/tipos-propiedad`),
        axios.get(`${config.apiUrl}api/misanuncios/tipos-operacion`),
        axios.get(`${config.apiUrl}api/misanuncios/tipos-ubicaciones`),
        axios.get(`${config.apiUrl}api/misanuncios/caracteristicas-catalogo`),
      ]);

      setTipos(resTipos.data);
      setOperaciones(resOps.data);
      setUbicaciones(resUbic.data);
      setCaracteristicas(resCarac.data.data || resCarac.data);
    } catch (error) {
      console.error("❌ Error cargando combos:", error);
    } finally {
      setCargando(false);
    }
  }

  // 🧩 Manejar check y valor
  const handleCheckChange = (id) => {
    setCaracteristicasSeleccionadas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: !prev[id]?.checked,
      },
    }));
  };

  const handleValorChange = (id, valor) => {
    setCaracteristicasSeleccionadas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        valor,
      },
    }));
  };

  // 🧩 Imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("imagen_principal", file);
      setImagen(URL.createObjectURL(file));
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="mb-4 text-success fw-bold">
        {anuncio ? "✏️ Editar anuncio" : "🏠 Publicar nuevo anuncio"}
      </h4>

      {cargando && <Cargando visible={true} />}

      <form onSubmit={formik.handleSubmit} className="row g-3">
        {/* Tipo */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Tipo</label>
          <select className="form-select" {...formik.getFieldProps("tipo_id")}>
            <option value="">Selecciona</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
          {formik.touched.tipo_id && formik.errors.tipo_id && (
            <small className="text-danger">{formik.errors.tipo_id}</small>
          )}
        </div>

        {/* Operación */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Operación</label>
          <select className="form-select" {...formik.getFieldProps("operacion_id")}>
            <option value="">Selecciona</option>
            {operaciones.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre}
              </option>
            ))}
          </select>
          {formik.touched.operacion_id && formik.errors.operacion_id && (
            <small className="text-danger">{formik.errors.operacion_id}</small>
          )}
        </div>

        {/* Ubicación */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Ubicación</label>
          <select className="form-select" {...formik.getFieldProps("ubicacion_id")}>
            <option value="">Selecciona</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
          {formik.touched.ubicacion_id && formik.errors.ubicacion_id && (
            <small className="text-danger">{formik.errors.ubicacion_id}</small>
          )}
        </div>

        {/* Título */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Título</label>
          <input type="text" className="form-control" {...formik.getFieldProps("titulo")} />
          {formik.touched.titulo && formik.errors.titulo && (
            <small className="text-danger">{formik.errors.titulo}</small>
          )}
        </div>

        {/* Descripción */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea
            rows="3"
            className="form-control"
            {...formik.getFieldProps("descripcion")}
          ></textarea>
          {formik.touched.descripcion && formik.errors.descripcion && (
            <small className="text-danger">{formik.errors.descripcion}</small>
          )}
        </div>

        {/* Precio */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Precio (S/)</label>
          <input type="number" className="form-control" {...formik.getFieldProps("precio")} />
          {formik.touched.precio && formik.errors.precio && (
            <small className="text-danger">{formik.errors.precio}</small>
          )}
        </div>

        {/* Imagen */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Imagen principal</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleImagenChange} />
          {formik.touched.imagen_principal && formik.errors.imagen_principal && (
            <small className="text-danger">{formik.errors.imagen_principal}</small>
          )}
          {imagen && (
            <div className="mt-3">
              <img
                src={imagen}
                alt="Vista previa"
                className="rounded shadow-sm"
                style={{ width: "200px", height: "150px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        {/* Características */}
        <div className="col-12 mt-3">
          <label className="form-label fw-semibold">Características</label>
          <div className="row">
            {caracteristicas.map((carac) => {
              console.log(carac);
              const checked = caracteristicasSeleccionadas[carac.id]?.checked || false;
              const valor = caracteristicasSeleccionadas[carac.id]?.valor || "";

              return (
                <div className="col-md-6 mb-2" key={carac.id}>
                  <div
                    className={`border rounded-3 p-2 d-flex align-items-center ${
                      checked ? "border-success bg-light" : ""
                    }`}
                  >
                    <div className="form-check me-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`carac-${carac.id}`}
                        checked={checked}
                        onChange={() => handleCheckChange(carac.id)}
                      />
                      <label htmlFor={`carac-${carac.id}`} className="form-check-label">
                        {carac.nombre}
                      </label>
                    </div>

                    {checked && (
                      <input
                        type="text"
                        className="form-control form-control-sm ms-2"
                        placeholder="Valor (opcional)"
                        value={valor}
                        onChange={(e) => handleValorChange(carac.id, e.target.value)}
                        style={{ maxWidth: "150px" }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón */}
        <div className="col-12 mt-4 text-end">
          <button type="submit" className="btn btn-success px-4 py-2 fw-bold rounded-3">
            {anuncio ? "💾 Guardar cambios" : "📢 Publicar anuncio"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoAnuncio;
