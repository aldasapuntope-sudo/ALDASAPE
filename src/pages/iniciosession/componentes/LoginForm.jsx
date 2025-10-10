import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { iniciarSesion } from "../logica/LoginLogica";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Cargando from "../../../components/cargando";
import { useState } from "react";

function Formulario() {

  const [cargando, setCargando] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      clave: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email no válido")
        .required("Debe ingresar un email válido"),
      clave: Yup.string().required("Debe ingresar una contraseña válida"),
    }),
    onSubmit: async (values) => {
      setCargando(true);
      try {
        const userData = await iniciarSesion({
          email: values.email,
          password: values.clave,
        });

        if (userData) {
          localStorage.setItem("usuario", JSON.stringify(userData));
          window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "Correo o clave incorrectos.",
            confirmButtonColor: "#d33",
            confirmButtonText: "Cerrar",
          });
        }
      } catch (error) {
        console.error("Error inesperado en login:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error inesperado al intentar iniciar sesión.",
        });
      } finally {
        setCargando(false);
      }
    },
  });

  return (
    <>
      <Cargando visible={cargando} /> 
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Correo electrónico</label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className={`form-control form-control-lg ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              placeholder="tuemail@ejemplo.com"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Contraseña</label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <FaLock />
            </span>
            <input
              type="password"
              className={`form-control form-control-lg ${
                formik.touched.clave && formik.errors.clave ? "is-invalid" : ""
              }`}
              placeholder="••••••••"
              name="clave"
              value={formik.values.clave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.clave && formik.errors.clave && (
              <div className="invalid-feedback">{formik.errors.clave}</div>
            )}
          </div>
        </div>

        <div className="text-end mb-3">
          <a href="/recover-password" className="text-success small fw-semibold">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
          Iniciar sesión
        </button>
      </form>
    </>
  );
}

export default Formulario;
