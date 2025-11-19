import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function PopupForm({ popup, onClose }) {
  const [preview, setPreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      titulo: "",
      descripcion: "",
      tiempo_segundos: 180, 
      orden: 0,                // 👈 NUEVO CAMPO
      is_active: 1,
      imagen_url: null,
    },
    validationSchema: Yup.object({
      titulo: Yup.string().required("El título es obligatorio"),
      tiempo_segundos: Yup.number()
        .min(10, "Mínimo 10 segundos")
        .required("El tiempo es obligatorio"),
      orden: Yup.number()
        .min(0, "El orden debe ser 0 o mayor")
        .required("El orden es obligatorio"), // 👈 VALIDACIÓN
    }),
    onSubmit: async (values) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "imagen_url" && value) {
          formData.append(key, value);
        } else if (key !== "imagen_url") {
          formData.append(key, value);
        }
      });

      try {
        if (popup) {
          formData.append("_method", "PUT");

          await axios.post(
            `${config.apiUrl}api/administracion/apopups/${popup.id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          Swal.fire("Actualizado", "Popup actualizado correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/rpopups`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          Swal.fire("Guardado", "Popup creado correctamente", "success");
        }

        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo guardar el popup", "error");
      }
    },
  });

  useEffect(() => {
    if (popup) {
      formik.setValues({
        titulo: popup.titulo || "",
        descripcion: popup.descripcion || "",
        tiempo_segundos: popup.tiempo_segundos || 180,
        orden: popup.orden || 0,      // 👈 AGREGADO AQUÍ
        is_active: popup.is_active ?? 1,
        imagen_url: null,
      });

      if (popup.imagen_url) {
        setPreview(`${config.urlserver}${popup.imagen_url}`);
      }
    }
  }, [popup]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("imagen_url", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal show fade d-block">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {popup ? "Editar Popup" : "Agregar Nuevo Popup"}
            </h5>
            <button
              className="btn btn-light btn-sm rounded-circle"
              onClick={() => onClose(false)}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <div className="modal-body">
              <div className="row">

                <div className="col-md-6 mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        className="form-control"
                        value={formik.values.titulo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.titulo && formik.errors.titulo && (
                        <div className="text-danger small">{formik.errors.titulo}</div>
                    )}
                </div>

                <div className="col-md-3 mb-3">
                    <label className="form-label">Tiempo (segundos)</label>
                    <input
                        type="number"
                        name="tiempo_segundos"
                        className="form-control"
                        value={formik.values.tiempo_segundos}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.tiempo_segundos && formik.errors.tiempo_segundos && (
                        <div className="text-danger small">{formik.errors.tiempo_segundos}</div>
                    )}
                </div>

                <div className="col-md-3 mb-3">
                    <label className="form-label">Orden</label>
                    <input
                        type="number"
                        name="orden"
                        className="form-control"
                        value={formik.values.orden}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.orden && formik.errors.orden && (
                        <div className="text-danger small">{formik.errors.orden}</div>
                    )}
                </div>


                <div className="col-md-12 mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="descripcion"
                    className="form-control"
                    rows={3}
                    value={formik.values.descripcion}
                    onChange={formik.handleChange}
                  ></textarea>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  {preview && (
                    <img
                      src={preview}
                      className="mt-2 rounded border"
                      alt="preview"
                      width="200"
                    />
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Estado</label>
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
              <button className="btn btn-success" type="submit">
                {popup ? "Actualizar" : "Guardar"}
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
