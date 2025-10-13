import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useUsuario } from "../../../context/UserContext";
import Cargando from "../../../components/cargando";
import config from "../../../config";
import axios from "axios";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";

export default function NuevoAnuncio() {
  const { usuario } = useUsuario();
  const [tipos, setTipos] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    cargarCombos();
  }, []);

  async function cargarCombos() {
    setCargando(true);
    try {
        const [resTipos, resOps, resUbic] = await Promise.all([
        axios.get(`${config.apiUrl}api/misanuncios/tipos-propiedad`),
        axios.get(`${config.apiUrl}api/misanuncios/tipos-operacion`),
        axios.get(`${config.apiUrl}api/misanuncios/tipos-ubicaciones`),
        ]);

        setTipos(resTipos.data);
        setOperaciones(resOps.data);
        setUbicaciones(resUbic.data);
    } catch (error) {
        console.error("Error cargando combos:", error);
    } finally {
      setCargando(false);
    }
}


  const formik = useFormik({
    initialValues: {
      tipo_id: "",
      operacion_id: "",
      ubicacion_id: "",
      titulo: "",
      descripcion: "",
      precio: "",
      dormitorios: "",
      banos: "",
      area: "",
      imagen_principal: null,
    },
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
      area: Yup.string().required("El área es obligatoria"),
      dormitorios: Yup.number()
        .typeError("Debe ser un número")
        .min(0, "Debe ser positivo"),
      banos: Yup.number()
        .typeError("Debe ser un número")
        .min(0, "Debe ser positivo"),
    }),
    onSubmit: async (values) => {
      setCargando(true);

      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("user_id", usuario?.usuarioaldasa?.id);

        const response = await fetch(`${config.apiUrl}api/misanuncios/registrar`, {
          method: "POST",
          body: formData,
        });

        console.log(response);
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Anuncio publicado",
            text: "Tu propiedad ha sido publicada exitosamente",
          });
          formik.resetForm();
          setImagen(null);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "No se pudo publicar el anuncio",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor",
        });
      } finally {
        setCargando(false);
      }
    },
  });

  const handleImagen = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("imagen_principal", file);
    setImagen(URL.createObjectURL(file));
  };

  return (
    <>
        <Cargando visible={cargando} />

        <BreadcrumbALDASA />

        <div className="container mt-4">

        <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4">
            <h4 className="mb-4 text-success fw-bold">
                🏠 Publicar nuevo anuncio
            </h4>

            <form onSubmit={formik.handleSubmit} className="row g-3">

                {/* Tipo de Propiedad */}
                <div className="col-md-4">
                <label className="form-label">Tipo de Propiedad</label>
                <select
                    name="tipo_id"
                    className={`form-select ${
                    formik.touched.tipo_id && formik.errors.tipo_id
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.tipo_id}
                    onChange={formik.handleChange}
                >
                    <option value="">Seleccione...</option>
                    {tipos.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.nombre.toUpperCase()}
                    </option>
                    ))}
                </select>
                <div className="invalid-feedback">{formik.errors.tipo_id}</div>
                </div>

                {/* Tipo de Operación */}
                <div className="col-md-4">
                <label className="form-label">Operación</label>
                <select
                    name="operacion_id"
                    className={`form-select ${
                    formik.touched.operacion_id && formik.errors.operacion_id
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.operacion_id}
                    onChange={formik.handleChange}
                >
                    <option value="">Seleccione...</option>
                    {operaciones.map((o) => (
                    <option key={o.id} value={o.id}>
                        {o.nombre.toUpperCase()}
                    </option>
                    ))}
                </select>
                <div className="invalid-feedback">
                    {formik.errors.operacion_id}
                </div>
                </div>

                {/* Ubicación */}
                <div className="col-md-4">
                <label className="form-label">Ubicación</label>
                <select
                    name="ubicacion_id"
                    className={`form-select ${
                    formik.touched.ubicacion_id && formik.errors.ubicacion_id
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.ubicacion_id}
                    onChange={formik.handleChange}
                >
                    <option value="">Seleccione...</option>
                    {ubicaciones.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.nombre.toUpperCase()}
                    </option>
                    ))}
                </select>
                <div className="invalid-feedback">
                    {formik.errors.ubicacion_id}
                </div>
                </div>

                {/* Título */}
                <div className="col-md-12">
                <label className="form-label">Título del anuncio</label>
                <input
                    type="text"
                    name="titulo"
                    className={`form-control ${
                    formik.touched.titulo && formik.errors.titulo
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.titulo}
                    onChange={formik.handleChange}
                />
                <div className="invalid-feedback">{formik.errors.titulo}</div>
                </div>

                {/* Descripción */}
                <div className="col-md-12">
                <label className="form-label">Descripción</label>
                <textarea
                    name="descripcion"
                    rows="4"
                    className={`form-control ${
                    formik.touched.descripcion && formik.errors.descripcion
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.descripcion}
                    onChange={formik.handleChange}
                ></textarea>
                <div className="invalid-feedback">
                    {formik.errors.descripcion}
                </div>
                </div>

                {/* Precio */}
                <div className="col-md-4">
                <label className="form-label">Precio (S/)</label>
                <input
                    type="number"
                    name="precio"
                    className={`form-control ${
                    formik.touched.precio && formik.errors.precio
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.precio}
                    onChange={formik.handleChange}
                />
                <div className="invalid-feedback">{formik.errors.precio}</div>
                </div>

                {/* Dormitorios */}
                <div className="col-md-4">
                <label className="form-label">Dormitorios</label>
                <input
                    type="number"
                    name="dormitorios"
                    className="form-control"
                    value={formik.values.dormitorios}
                    onChange={formik.handleChange}
                />
                </div>

                {/* Baños */}
                <div className="col-md-4">
                <label className="form-label">Baños</label>
                <input
                    type="number"
                    name="banos"
                    className="form-control"
                    value={formik.values.banos}
                    onChange={formik.handleChange}
                />
                </div>

                {/* Área */}
                <div className="col-md-4">
                <label className="form-label">Área (m²)</label>
                <input
                    type="text"
                    name="area"
                    className={`form-control ${
                    formik.touched.area && formik.errors.area
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.area}
                    onChange={formik.handleChange}
                />
                <div className="invalid-feedback">{formik.errors.area}</div>
                </div>

                {/* Imagen principal */}
                <div className="col-md-8">
                <label className="form-label">Imagen principal</label>
                <input
                    type="file"
                    name="imagen_principal"
                    accept="image/*"
                    className="form-control"
                    onChange={handleImagen}
                />
                {imagen && (
                    <img
                    src={imagen}
                    alt="Vista previa"
                    className="mt-3 rounded shadow-sm"
                    style={{ width: "180px", height: "130px", objectFit: "cover" }}
                    />
                )}
                </div>

                <div className="col-12 text-center mt-4">
                <button
                    type="submit"
                    className="btn btn-success px-4 py-2 fw-bold rounded-3"
                >
                    📢 Publicar anuncio
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    </>
  );
}
