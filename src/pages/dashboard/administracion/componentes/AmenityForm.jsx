import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function AmenityForm({ Servicio, onClose }) {
  const formik = useFormik({
    initialValues: {
      nombre: "",
      tpropiedad_id: "",
      is_active: 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      tpropiedad_id: Yup.number()
        .typeError("Debe ser un número válido")
        .required("El tipo de propiedad es obligatorio"),
    }),
    onSubmit: async (values) => {
      try {
        if (Servicio) {
          await axios.put(
            `${config.apiUrl}api/administracion/aamenities/${Servicio.id}`,
            values
          );
          Swal.fire("✅ Actualizado", "El servicio fue actualizado correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/ramenities`, values);
          Swal.fire("✅ Guardado", "El servicio fue creado correctamente", "success");
        }
        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("❌ Error", "Ocurrió un error al guardar el servicio", "error");
      }
    },
  });

  useEffect(() => {
    if (Servicio) {
      formik.setValues({
        nombre: Servicio.nombre || "",
        tpropiedad_id: Servicio.tpropiedad_id || "",
        is_active: Servicio.is_active ?? 1,
      });
    }
  }, [Servicio]);

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0 rounded-3">
          {/* 🔹 Encabezado */}
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title mb-0">
              {Servicio ? "Editar Servicio" : "Agregar Nuevo Servicio"}
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

          {/* 🔹 Formulario */}
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Nombre */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-control ${
                      formik.touched.nombre && formik.errors.nombre ? "is-invalid" : ""
                    }`}
                    placeholder="Ej: Piscina, Estacionamiento, etc."
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.nombre && formik.errors.nombre && (
                    <div className="invalid-feedback">{formik.errors.nombre}</div>
                  )}
                </div>

                {/* Tipo de Propiedad */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">ID Tipo de Propiedad</label>
                  <input
                    type="number"
                    name="tpropiedad_id"
                    className={`form-control ${
                      formik.touched.tpropiedad_id && formik.errors.tpropiedad_id
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Ej: 1, 2, 3..."
                    value={formik.values.tpropiedad_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.tpropiedad_id && formik.errors.tpropiedad_id && (
                    <div className="invalid-feedback">{formik.errors.tpropiedad_id}</div>
                  )}
                </div>

                {/* Estado */}
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

            {/* 🔹 Footer */}
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {Servicio ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onClose(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🔹 Fondo del modal */}
      <div
        className="modal-backdrop fade show"
        onClick={() => onClose(false)}
      ></div>
    </div>
  );
}
