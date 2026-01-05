import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../config";
import { useUsuario } from "../../context/UserContext";


export default function SoporteModal({ show, onClose }) {
  const [motivos, setMotivos] = useState([]);
    const { usuario } = useUsuario();

  /* ===============================
     FORMIK
  =============================== */
  const formik = useFormik({
    initialValues: {
      soporte_motivo_id: "",
      titulo: "",
      descripcion: "",
    },
    validationSchema: Yup.object({
      soporte_motivo_id: Yup.number()
        .typeError("Seleccione un motivo válido")
        .required("El motivo es obligatorio"),
      titulo: Yup.string().required("El título es obligatorio"),
      descripcion: Yup.string().required("La descripción es obligatoria"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(
          `${config.apiUrl}api/paginaprincipal/ticketssoporteyayuda/${usuario.usuarioaldasa.id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        Swal.fire("✅ Enviado", "Tu solicitud fue enviada correctamente", "success");
        resetForm();
        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire(
          "❌ Error",
          error?.response?.data?.message || "No se pudo enviar la solicitud",
          "error"
        );
      }
    },
  });

  /* ===============================
     CARGAR MOTIVOS
  =============================== */
  useEffect(() => {
    if (!show) return;

    const fetchMotivos = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}api/paginaprincipal/motivosoporteayuda`);
        setMotivos(res.data);
      } catch (error) {
        console.error("Error al cargar motivos:", error);
        Swal.fire("Error", "No se pudo cargar los motivos", "error");
      }
    };

    fetchMotivos();
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0 rounded-3">

          {/* HEADER */}
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">Soporte y Ayuda</h5>
            <button
              type="button"
              className="btn btn-light btn-sm rounded-circle"
              onClick={() => onClose(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row">

                {/* MOTIVO */}
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Motivo</label>
                  <select
                    name="soporte_motivo_id"
                    className={`form-select ${
                      formik.touched.soporte_motivo_id && formik.errors.soporte_motivo_id
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.soporte_motivo_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Seleccione un motivo</option>
                    {motivos.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                  {formik.touched.soporte_motivo_id &&
                    formik.errors.soporte_motivo_id && (
                      <div className="invalid-feedback">
                        {formik.errors.soporte_motivo_id}
                      </div>
                    )}
                </div>

                {/* TITULO */}
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    className={`form-control ${
                      formik.touched.titulo && formik.errors.titulo ? "is-invalid" : ""
                    }`}
                    value={formik.values.titulo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.titulo && formik.errors.titulo && (
                    <div className="invalid-feedback">{formik.errors.titulo}</div>
                  )}
                </div>

                {/* DESCRIPCION */}
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows="4"
                    className={`form-control ${
                      formik.touched.descripcion && formik.errors.descripcion
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.descripcion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.descripcion && formik.errors.descripcion && (
                    <div className="invalid-feedback">{formik.errors.descripcion}</div>
                  )}
                </div>

              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Enviar
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

      {/* BACKDROP */}
      <div className="modal-backdrop fade show" onClick={() => onClose(false)}></div>
    </div>
  );
}
