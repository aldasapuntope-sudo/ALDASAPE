import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function TipoDocumentoForm({ tipo, onClose }) {
  // ✅ Configuración Formik
  const formik = useFormik({
    initialValues: {
      nombre: "",
      is_active: 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .required("El nombre es obligatorio")
        .max(255, "Máximo 255 caracteres"),
    }),
    onSubmit: async (values) => {
      try {
        if (tipo) {
          await axios.put(
            `${config.apiUrl}api/administracion/atipodocumento/${tipo.id}`,
            values
          );
          Swal.fire("Actualizado", "El tipo de documento fue actualizado correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/rtipodocumento`, values);
          Swal.fire("Guardado", "El tipo de documento fue creado correctamente", "success");
        }
        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Ocurrió un error al guardar el tipo de documento", "error");
      }
    },
  });

  // ✅ Cargar datos si es edición
  useEffect(() => {
    if (tipo) {
      formik.setValues({
        nombre: tipo.nombre || "",
        is_active: tipo.is_active ?? 1,
      });
    }
  }, [tipo]);

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-md modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg rounded-3 border-0">
          {/* Header */}
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {tipo ? "Editar Tipo de Documento" : "Agregar Tipo de Documento"}
            </h5>
            <button type="button" className="btn btn-light btn-sm rounded-circle" onClick={() => onClose(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              {/* Campo: Nombre */}
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
                  onBlur={formik.handleBlur}
                  placeholder="Ej. DNI, Pasaporte, Carnet de extranjería"
                />
                {formik.touched.nombre && formik.errors.nombre && (
                  <div className="invalid-feedback">{formik.errors.nombre}</div>
                )}
              </div>

              {/* Campo: Estado */}
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

            {/* Footer */}
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {tipo ? "Actualizar" : "Guardar"}
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

      {/* Fondo del modal */}
      <div className="modal-backdrop fade show" onClick={() => onClose(false)}></div>
    </div>
  );
}
