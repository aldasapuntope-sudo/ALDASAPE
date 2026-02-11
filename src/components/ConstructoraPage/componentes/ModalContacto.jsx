import { useState } from "react";
import * as Yup from "yup";

const schema = Yup.object({
  nombre: Yup.string().required("Ingresa tu nombre"),
  correo: Yup.string()
    .email("Correo inválido")
    .required("Ingresa tu correo"),
  mensaje: Yup.string().required("Escribe un mensaje"),
});

export default function ModalContacto({ abierto, onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState({});

  if (!abierto) return null;

  /* VALIDACIÓN POR CAMPO */
  const validarCampo = async (campo, valor) => {
    try {
      await schema.validateAt(campo, { ...form, [campo]: valor });
      setErrors((e) => ({ ...e, [campo]: null }));
    } catch (err) {
      setErrors((e) => ({ ...e, [campo]: err.message }));
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validarCampo(name, value);
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      alert("Formulario enviado correctamente ✅");
      onClose();
    } catch (err) {
      const nuevosErrores = {};
      err.inner.forEach((e) => {
        nuevosErrores[e.path] = e.message;
      });
      setErrors(nuevosErrores);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title fw-bold">Contáctanos</h5>
              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {/* NOMBRE */}
              <div className="mb-3">
                <input
                  className={`form-control ${
                    errors.nombre ? "is-invalid" : ""
                  }`}
                  name="nombre"
                  placeholder="Nombre completo"
                  value={form.nombre}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.nombre && (
                  <div className="invalid-feedback">
                    {errors.nombre}
                  </div>
                )}
              </div>

              {/* CORREO */}
              <div className="mb-3">
                <input
                  className={`form-control ${
                    errors.correo ? "is-invalid" : ""
                  }`}
                  name="correo"
                  placeholder="Correo electrónico"
                  value={form.correo}
                  onChange={handleChange}
                  disabled={!form.nombre || errors.nombre}
                />
                {errors.correo && (
                  <div className="invalid-feedback">
                    {errors.correo}
                  </div>
                )}
              </div>

              {/* MENSAJE */}
              <div className="mb-3">
                <textarea
                  className={`form-control ${
                    errors.mensaje ? "is-invalid" : ""
                  }`}
                  name="mensaje"
                  rows="3"
                  placeholder="Mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  disabled={!form.correo || errors.correo}
                />
                {errors.mensaje && (
                  <div className="invalid-feedback">
                    {errors.mensaje}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-success w-100"
                disabled={
                  !form.nombre ||
                  !form.correo ||
                  !form.mensaje ||
                  Object.values(errors).some(Boolean)
                }
                onClick={handleSubmit}
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
