import React from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import config from "../../../../config";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function UbicacionForm({ ubicacion, onClose }) {
  const formik = useFormik({
    initialValues: {
      nombre: ubicacion?.nombre || "",
      is_active: ubicacion?.is_active ?? 1,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nombre: Yup.string().required("Ingrese un nombre"),
    }),
    onSubmit: async (values) => {
      try {
        if (ubicacion) {
          await axios.put(
            `${config.apiUrl}api/administracion/aubicaciones/${ubicacion.id}`,
            values
          );
          Swal.fire("Actualizado", "La ubicación fue actualizada correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/rubicaciones`, values);
          Swal.fire("Guardado", "La ubicación fue registrada correctamente", "success");
        }
        onClose(true);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo guardar la ubicación", "error");
      }
    },
  });

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {ubicacion ? "Editar Ubicación" : "Nueva Ubicación"}
            </h5>
            <button className="btn btn-light btn-sm rounded-circle" onClick={() => onClose(false)}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="fw-semibold">Nombre</label>
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
                <div className="invalid-feedback">{formik.errors.nombre}</div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold">Estado</label>
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
                {ubicacion ? "Actualizar" : "Guardar"}
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
