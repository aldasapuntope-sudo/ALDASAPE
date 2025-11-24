import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function ConfigScriptsForm({ scriptItem, onClose }) {
  
  const formik = useFormik({
    initialValues: {
      nombre: "",
      script_head: "",
      script_body: "",
      is_active: 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      script_head: Yup.string().nullable(),
      script_body: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        if (scriptItem) {
          await axios.put(`${config.apiUrl}api/administracion/ascripts/${scriptItem.id}`, values);
          Swal.fire("Actualizado", "Script actualizado correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/rscripts`, values);
          Swal.fire("Guardado", "Script creado correctamente", "success");
        }
        onClose(true);
      } catch {
        Swal.fire("Error", "Ocurrió un error", "error");
      }
    },
  });

  useEffect(() => {
    if (scriptItem) {
      formik.setValues({
        nombre: scriptItem.nombre,
        script_head: scriptItem.script_head,
        script_body: scriptItem.script_body,
        is_active: scriptItem.is_active,
      });
    }
  }, [scriptItem]);

  return (
    <div className="modal show fade d-block">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {scriptItem ? "Editar Script" : "Nuevo Script"}
            </h5>
            <button className="btn btn-light btn-sm" onClick={() => onClose(false)}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Script HEAD</label>
                <textarea
                  name="script_head"
                  rows="6"
                  className="form-control"
                  value={formik.values.script_head}
                  onChange={formik.handleChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Script BODY</label>
                <textarea
                  name="script_body"
                  rows="6"
                  className="form-control"
                  value={formik.values.script_body}
                  onChange={formik.handleChange}
                ></textarea>
              </div>

              <div className="mb-3">
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

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {scriptItem ? "Actualizar" : "Guardar"}
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
