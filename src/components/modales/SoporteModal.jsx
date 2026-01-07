import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
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
        onClose(false);
      } catch (error) {
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
        const res = await axios.get(
          `${config.apiUrl}api/paginaprincipal/motivosoporteayuda`
        );
        setMotivos(res.data);
      } catch {
        Swal.fire("Error", "No se pudo cargar los motivos", "error");
      }
    };

    fetchMotivos();
  }, [show]);

  if (!show) return null;

  /* ===============================
     MODAL CON PORTAL
  =============================== */
  return createPortal(
    <Modal show={show} onHide={() => onClose(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Soporte y Ayuda</Modal.Title>
      </Modal.Header>

      <form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          {/* MOTIVO */}
          <div className="mb-3">
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
            <div className="invalid-feedback">
              {formik.errors.soporte_motivo_id}
            </div>
          </div>

          {/* TITULO */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Título</label>
            <input
              type="text"
              name="titulo"
              className={`form-control ${
                formik.touched.titulo && formik.errors.titulo ? "is-invalid" : ""
              }`}
              value={formik.values.titulo}
              onChange={formik.handleChange}
            />
            <div className="invalid-feedback">{formik.errors.titulo}</div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="mb-3">
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
            />
            <div className="invalid-feedback">{formik.errors.descripcion}</div>
          </div>
        </Modal.Body>

        <Modal.Footer>
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
        </Modal.Footer>
      </form>
    </Modal>,
    document.body
  );
}
