import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function ChatRespuestaForm({ respuesta, onClose }) {
  const formik = useFormik({
    initialValues: {
      palabras_clave: "",
      respuesta: "",
      prioridad: 1,
      is_active: 1,
    },
    validationSchema: Yup.object({
      palabras_clave: Yup.string().required("Las palabras clave son obligatorias"),
      respuesta: Yup.string().required("La respuesta es obligatoria"),
    }),
    onSubmit: async (values) => {
      try {
        if (respuesta) {
          await axios.put(
            `${config.apiUrl}api/administracion/achat-respuesta/${respuesta.id}`,
            values
          );
          Swal.fire("Actualizado", "Respuesta actualizada correctamente", "success");
        } else {
          await axios.post(
            `${config.apiUrl}api/administracion/rchat-respuesta`,
            values
          );
          Swal.fire("Guardado", "Respuesta creada correctamente", "success");
        }
        onClose(true);
      } catch {
        Swal.fire("Error", "No se pudo guardar la respuesta", "error");
      }
    },
  });

  useEffect(() => {
    if (respuesta) {
      formik.setValues({
        palabras_clave: respuesta.palabras_clave || "",
        respuesta: respuesta.respuesta || "",
        prioridad: respuesta.prioridad || 1,
        is_active: respuesta.is_active ?? 1,
      });
    }
  }, [respuesta]);

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {respuesta ? "Editar Respuesta del Chatbot" : "Nueva Respuesta del Chatbot"}
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

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body px-5 py-4">

              <div className="row">
                <div className="col-md-8 mb-4">
                  <label className="form-label fw-semibold fs-5">
                    Palabras clave
                  </label>
                  <input
                    type="text"
                    name="palabras_clave"
                    className="form-control form-control-lg"
                    value={formik.values.palabras_clave}
                    onChange={formik.handleChange}
                  />
                  <small className="text-muted">
                    Separar por comas (ej: precio,costo,vale)
                  </small>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="form-label fw-semibold fs-5">
                    Prioridad
                  </label>
                  <input
                    type="number"
                    name="prioridad"
                    className="form-control form-control-lg"
                    value={formik.values.prioridad}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold fs-5">
                  Respuesta del Bot
                </label>
                <textarea
                  name="respuesta"
                  rows="6"
                  className="form-control form-control-lg"
                  style={{ resize: "vertical" }}
                  value={formik.values.respuesta}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold fs-5">
                  Estado
                </label>
                <select
                  name="is_active"
                  className="form-select form-select-lg"
                  value={formik.values.is_active}
                  onChange={formik.handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>

            </div>

            <div className="modal-footer px-5 py-3">
              <button type="submit" className="btn btn-success btn-lg px-4">
                {respuesta ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg px-4"
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