import React, { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function ConfigPopupForm({ popupItem, onClose }) {
  const formik = useFormik({
    initialValues: {
      tiempo_inicio_seg: 5,
    },
    validationSchema: Yup.object({
      tiempo_inicio_seg: Yup.number().required().min(1),
    }),
    onSubmit: async (values) => {
      try {
        await axios.put(
          `${config.apiUrl}api/administracion/apopupconfig/${popupItem.id}`,
          values
        );
        Swal.fire("Actualizado", "Configuración actualizada correctamente", "success");
        onClose(true);
      } catch {
        Swal.fire("Error", "No se pudo actualizar", "error");
      }
    },
  });

  useEffect(() => {
    if (popupItem) {
      formik.setValues({
        tiempo_inicio_seg: popupItem.tiempo_inicio_seg,
      });
    }
  }, [popupItem]);

  return (
    <div className="modal show fade d-block">
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">

          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">Editar Configuración del Popup</h5>
            <button className="btn btn-light btn-sm" onClick={() => onClose(false)}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">

              <label className="form-label">Tiempo de inicio (segundos)</label>
              <input
                type="number"
                name="tiempo_inicio_seg"
                className="form-control"
                value={formik.values.tiempo_inicio_seg}
                onChange={formik.handleChange}
              />

            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Actualizar
              </button>
              <button className="btn btn-secondary" onClick={() => onClose(false)}>
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
