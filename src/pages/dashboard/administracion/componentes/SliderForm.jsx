import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function SliderForm({ slider, onClose }) {
  const [preview, setPreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      titulo: "",
      descripcion: "",
      orden: 0,
      is_active: 1,
      imagen_url: null,
    },
    validationSchema: Yup.object({
      titulo: Yup.string().required("El título es obligatorio"),
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
        if (slider) {
          formData.append("_method", "PUT");

        
          await axios.post(
            `${config.apiUrl}api/administracion/aslider/${slider.id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          Swal.fire("✅ Actualizado", "El slider fue actualizado correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/rslider`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          Swal.fire("✅ Guardado", "El slider fue creado correctamente", "success");
        }
        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("❌ Error", "No se pudo guardar el slider", "error");
      }
    },
  });

  useEffect(() => {
    if (slider) {
      formik.setValues({
        titulo: slider.titulo || "",
        descripcion: slider.descripcion || "",
        orden: slider.orden || 0,
        is_active: slider.is_active ?? 1,
        imagen_url: null,
      });

      if (slider.imagen_url) {
        setPreview(`${config.urlserver}${slider.imagen_url}`);
      }
    }
  }, [slider]);

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
    <div className="modal show fade d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {slider ? "Editar Slider" : "Agregar Nuevo Slider"}
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
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Orden</label>
                  <input
                    type="number"
                    name="orden"
                    className="form-control"
                    value={formik.values.orden}
                    onChange={formik.handleChange}
                  />
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
                {slider ? "Actualizar" : "Guardar"}
              </button>
              <button className="btn btn-secondary" onClick={() => onClose(false)}>
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
