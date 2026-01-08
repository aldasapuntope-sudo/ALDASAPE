import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function SoporteMotivoForm({ motivo, onClose }) {
  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      is_active: 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
    }),
    onSubmit: async (values) => {
      try {
        if (motivo) {
          await axios.put(
            `${config.apiUrl}api/administracion/asoporte-motivo/${motivo.id}`,
            values
          );
          Swal.fire("✅ Actualizado", "Motivo actualizado correctamente", "success");
        } else {
          await axios.post(
            `${config.apiUrl}api/administracion/rsoporte-motivo`,
            values
          );
          Swal.fire("✅ Guardado", "Motivo creado correctamente", "success");
        }
        onClose(true);
      } catch {
        Swal.fire("❌ Error", "No se pudo guardar el motivo", "error");
      }
    },
  });

  useEffect(() => {
    if (motivo) {
      formik.setValues({
        nombre: motivo.nombre || "",
        descripcion: motivo.descripcion || "",
        is_active: motivo.is_active ?? 1,
      });
    }
  }, [motivo]);

  return (
    <div className="modal show fade d-block">
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">

          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {motivo ? "Editar Motivo" : "Nuevo Motivo"}
            </h5>
            <button
              className="btn btn-light btn-sm"
              onClick={() => onClose(false)}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">

              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control ${
                    formik.touched.nombre && formik.errors.nombre ? "is-invalid" : ""
                  }`}
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                />
                <div className="invalid-feedback">{formik.errors.nombre}</div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Descripción</label>
                <textarea
                  name="descripcion"
                  rows="3"
                  className="form-control"
                  value={formik.values.descripcion}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="mb-3">
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

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {motivo ? "Actualizar" : "Guardar"}
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

      <div className="modal-backdrop fade show"></div>
    </div>
  );
}
