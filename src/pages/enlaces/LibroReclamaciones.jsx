import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import "../../css/Login.css";
import "../../css/LibroReclamaciones.css";
import config from "../../config";
import Cargando from "../../components/cargando";

export default function LibroReclamaciones() {
  const [cargando, setCargando] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      documento: "",
      correo: "",
      telefono: "",
      tipo: "reclamo",
      detalle: "",
    },

    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      documento: Yup.string()
        .required("El documento es obligatorio")
        .matches(/^[0-9]+$/, "Solo números"),
      correo: Yup.string()
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      telefono: Yup.string()
        .nullable()
        .matches(/^[0-9]*$/, "Solo números"),
      tipo: Yup.string().required("Selecciona un tipo"),
      detalle: Yup.string()
        .required("El detalle es obligatorio")
        .min(10, "Describe mejor tu reclamo"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setCargando(true);
      try {
        const res = await fetch(
          `${config.apiUrl}api/paginaprincipal/registrarlibroreclamaciones`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Reclamo enviado",
            text: "Tu reclamo ha sido registrado correctamente.",
          });
          resetForm();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.mensaje || "No se pudo registrar el reclamo.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo conectar con el servidor.",
        });
      } finally {
        setSubmitting(false);
        setCargando(false);
      }
    },
  });

  return (
    <>
      <Cargando visible={cargando} />

      <div className="auth-page">
        <div className="auth-overlay"></div>

        <div className="auth-container">
          <div className="auth-card shadow-lg rounded-4 p-4">
            <h2 className="text-center mb-3 fw-bold text-success">
              Libro de Reclamaciones
            </h2>

            <p className="text-center text-muted mb-4">
              Conforme al Código de Protección y Defensa del Consumidor – INDECOPI
            </p>

            <form onSubmit={formik.handleSubmit}>
              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  {...formik.getFieldProps("nombre")}
                />
                {formik.touched.nombre && formik.errors.nombre && (
                  <small className="text-danger">{formik.errors.nombre}</small>
                )}
              </div>

              {/* Documento */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  DNI / Documento
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...formik.getFieldProps("documento")}
                />
                {formik.touched.documento && formik.errors.documento && (
                  <small className="text-danger">
                    {formik.errors.documento}
                  </small>
                )}
              </div>

              {/* Correo */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  {...formik.getFieldProps("correo")}
                />
                {formik.touched.correo && formik.errors.correo && (
                  <small className="text-danger">{formik.errors.correo}</small>
                )}
              </div>

              {/* Teléfono */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  {...formik.getFieldProps("telefono")}
                />
                {formik.touched.telefono && formik.errors.telefono && (
                  <small className="text-danger">
                    {formik.errors.telefono}
                  </small>
                )}
              </div>

              {/* Tipo */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Tipo</label>
                <select
                  className="form-select"
                  {...formik.getFieldProps("tipo")}
                >
                  <option value="reclamo">Reclamo</option>
                  <option value="queja">Queja</option>
                </select>
              </div>

              {/* Detalle */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Detalle</label>
                <textarea
                  rows="5"
                  className="form-control"
                  {...formik.getFieldProps("detalle")}
                />
                {formik.touched.detalle && formik.errors.detalle && (
                  <small className="text-danger">
                    {formik.errors.detalle}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 py-2 fw-semibold mt-3"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Enviando..." : "Enviar Reclamo"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
