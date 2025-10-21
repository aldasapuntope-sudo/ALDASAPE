import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function CaracteristicaForm({ Caracteristica, onClose }) {
  const [preview, setPreview] = useState(null);
  const [tiposPropiedad, setTiposPropiedad] = useState([]); // 🔹 Lista de tipos de propiedad

  const formik = useFormik({
    initialValues: {
      nombre: "",
      unidad: "",
      tpropiedad_id: "",
      is_active: 1,
      icono: null,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      tpropiedad_id: Yup.number()
        .typeError("Debe seleccionar un tipo de propiedad válido")
        .required("El tipo de propiedad es obligatorio"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "icono" && value) {
          formData.append(key, value);
        } else if (key !== "icono") {
          formData.append(key, value);
        }
      });

      try {
        if (Caracteristica) {
          formData.append("_method", "PUT");
          await axios.post(
            `${config.apiUrl}api/administracion/acaracteristica/${Caracteristica.id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          Swal.fire("✅ Actualizado", "La característica fue actualizada correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/rcaracteristica`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          Swal.fire("✅ Guardado", "La característica fue creada correctamente", "success");
        }
        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("❌ Error", "Ocurrió un error al guardar la característica", "error");
      }
    },
  });

  // 🔹 Cargar tipos de propiedad al montar el componente
  useEffect(() => {
    const fetchTiposPropiedad = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}api/administracion/tipos-propiedad`);
        setTiposPropiedad(res.data);
      } catch (error) {
        console.error("Error al obtener tipos de propiedad:", error);
      }
    };
    fetchTiposPropiedad();
  }, []);

  // 🔹 Si estamos editando, cargamos datos existentes
  useEffect(() => {
    if (Caracteristica) {
      formik.setValues({
        nombre: Caracteristica.nombre || "",
        unidad: Caracteristica.unidad || "",
        tpropiedad_id: Caracteristica.tpropiedad_id || "",
        is_active: Caracteristica.is_active ?? 1,
        icono: null,
      });

      if (Caracteristica.icono) {
        setPreview(`${config.urlserver}iconos/${Caracteristica.icono}`);
      }
    }
  }, [Caracteristica]);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("icono", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title mb-0">
              {Caracteristica ? "Editar Característica" : "Agregar Nueva Característica"}
            </h5>
            <button
              type="button"
              className="btn btn-light btn-sm rounded-circle"
              onClick={() => onClose(false)}
              title="Cerrar"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-control ${
                      formik.touched.nombre && formik.errors.nombre ? "is-invalid" : ""
                    }`}
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.nombre && formik.errors.nombre && (
                    <div className="invalid-feedback">{formik.errors.nombre}</div>
                  )}
                </div>

                {/* 🔹 Tipo de Propiedad reemplaza al campo Tipo */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Tipo de Propiedad</label>
                  <select
                    name="tpropiedad_id"
                    className={`form-select ${
                      formik.touched.tpropiedad_id && formik.errors.tpropiedad_id ? "is-invalid" : ""
                    }`}
                    value={formik.values.tpropiedad_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Seleccione un tipo...</option>
                    {tiposPropiedad.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  {formik.touched.tpropiedad_id && formik.errors.tpropiedad_id && (
                    <div className="invalid-feedback">{formik.errors.tpropiedad_id}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Unidad</label>
                  <input
                    type="text"
                    name="unidad"
                    className="form-control"
                    placeholder="Ej: m², unidades, etc."
                    value={formik.values.unidad}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Ícono (16x16px)</label>
                  <input
                    type="file"
                    name="icono"
                    accept="image/*"
                    className="form-control"
                    onChange={handleIconChange}
                  />
                  {preview && (
                    <div className="mt-2">
                      <img
                        src={preview}
                        alt="Vista previa"
                        width="32"
                        height="32"
                        className="border rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Estado</label>
                  <select
                    name="is_active"
                    className="form-select"
                    value={formik.values.is_active}
                    onChange={formik.handleChange}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {Caracteristica ? "Actualizar" : "Guardar"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => onClose(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={() => onClose(false)}></div>
    </div>
  );
}
