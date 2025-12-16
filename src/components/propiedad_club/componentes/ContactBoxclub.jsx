import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaWhatsapp, FaPhoneAlt, FaStar, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../../config";
import Cargando from "../../cargando";

export default function ContactBoxclub({ anuncio }) {

  
  const [cargando, setCargando] = useState(false);

  const whatsappUrl = `https://wa.me/${anuncio?.perfilanunciante?.telefono_movil}?text=Hola%20${anuncio?.perfilanunciante?.nombre},%20vi%20tu%20anuncio%20sobre%20${anuncio.operaciones}%20de%20${anuncio.titulo}%20en%20*ALDASA.PE*`;
  const callUrl = `tel:${anuncio?.perfilanunciante?.telefono_movil}`;

  const formik = useFormik({
    initialValues: {
      email: "",
      nombre: "",
      telefono: "",
      dni: "",
      mensaje: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
      nombre: Yup.string().required("Tu nombre es obligatorio"),
      telefono: Yup.string()
        .matches(/^[0-9]{9}$/, "Debe tener 9 dígitos")
        .required("El teléfono es obligatorio"),
      dni: Yup.string()
        .matches(/^[0-9]{8}$/, "Debe tener 8 dígitos")
        .required("El DNI es obligatorio"),
      mensaje: Yup.string().required("Debes escribir un mensaje"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setCargando(true);
      try {
        const response = await axios.post(`${config.apiUrl}api/paginaprincipal/rmensajeanunciante`, {
            ...values,
            telefono: String(values.telefono),
            dni: String(values.dni),
            anuncioid: anuncio.id,
            anuncianteid: anuncio.perfilanunciante.idanunciante,
        });


        if (response.data.success) {
          Swal.fire("¡Enviado!", "Tu mensaje fue enviado con éxito.", "success");
          resetForm();
        } else {
          Swal.fire("Error", response.data.message || "No se pudo enviar el mensaje.", "error");
        }
      } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 422) {
            const errores = error.response.data.errors;
            let mensaje = "";

            // Diccionario de traducciones comunes
            const traducciones = {
            "The :attribute field is required.": "El campo :attribute es obligatorio.",
            "The :attribute field must be a string.": "El campo :attribute debe ser texto.",
            "The :attribute must be a valid email address.": "El campo :attribute debe ser un correo electrónico válido.",
            "The :attribute field must be an integer.": "El campo :attribute debe ser un número entero.",
            "The :attribute format is invalid.": "El formato del campo :attribute no es válido.",
            "The :attribute must be at least :min characters.": "El campo :attribute debe tener al menos :min caracteres.",
            "The :attribute may not be greater than :max characters.": "El campo :attribute no debe tener más de :max caracteres.",
            };

            // Traducción dinámica
            for (const campo in errores) {
            const erroresCampo = errores[campo].map((msg) => {
                let traducido = msg;

                // Buscar traducción exacta o parcial
                for (const en in traducciones) {
                if (msg.includes(en.split(":attribute")[0].trim())) {
                    traducido = traducciones[en]
                    .replace(":attribute", campo)
                    .replace(":min", msg.match(/\d+/)?.[0] || "")
                    .replace(":max", msg.match(/\d+/)?.[0] || "");
                    break;
                }
                }

                return traducido;
            });

            // Capitalizamos el campo (por estética)
            const campoLabel = campo.charAt(0).toUpperCase() + campo.slice(1);
            mensaje += `<strong>${campoLabel}:</strong> ${erroresCampo.join(", ")}<br>`;
            }

            Swal.fire({
            icon: "error",
            title: "Errores de validación",
            html: mensaje,
            });
        } else {
            Swal.fire("Error", "No se pudo enviar el mensaje.", "error");
        }
        } finally {
        setCargando(false);
      }
    },
  });

  // 🔒 Bloquear campos según el orden
  const emailOk = formik.values.email && !formik.errors.email;
  const nombreOk = emailOk && formik.values.nombre && !formik.errors.nombre;
  const telefonoOk = nombreOk && formik.values.telefono && !formik.errors.telefono;
  const dniOk = telefonoOk && formik.values.dni && !formik.errors.dni;

  return (
    <>
      <Cargando visible={cargando} />
      <div className="widget widget-contact-box d-none d-md-block">
        <h3 className="widget-subtitle">Contactar anunciante</h3>

        <div className="media d-flex align-items-center">
          <div className="flex-shrink-0">
            <div className="item-logo">
              <img
                src={
                  anuncio?.perfilanunciante?.imagen
                    ? anuncio?.perfilanunciante?.imagen
                    : "/img/default-user.png"
                }
                alt={anuncio?.perfilanunciante?.nombre}
                width="100"
                height="100"
                className="rounded-circle"
              />
            </div>
          </div>
          <div className="media-body flex-grow-1 ms-3">
            <h4 className="item-title">{anuncio?.perfilanunciante?.nombre}</h4>
            <div className="item-phn">
              {anuncio?.perfilanunciante?.telefono_movil}{" "}
              <a href={callUrl}>
                <span>(Llamar)</span>
              </a>
            </div>
            <div className="item-mail">{anuncio?.perfilanunciante?.email}</div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="contact-box rt-contact-form mt-3 floating-form">
        {["email", "nombre", "telefono", "dni", "mensaje"].map((field) => (
            <div className="form-group mb-3" key={field}>
            <div className="form-floating-label">
                {field === "mensaje" ? (
                <textarea
                    placeholder=" "
                    className="form-control"
                    name={field}
                    rows="3"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field]}
                    disabled={!dniOk}
                />
                ) : (
                <input
                    placeholder=" "
                    type={
                    field === "email"
                        ? "email"
                        : field === "telefono" || field === "dni"
                        ? "number"
                        : "text"
                    }
                    className="form-control"
                    name={field}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field]}
                    disabled={
                    (field === "nombre" && !emailOk) ||
                    (field === "telefono" && !nombreOk) ||
                    (field === "dni" && !telefonoOk)
                    }
                />
                )}
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            </div>

            {formik.touched[field] && formik.errors[field] && (
                <small className="text-danger">{formik.errors[field]}</small>
            )}
            </div>
        ))}

        <button
            type="submit"
            className="btn btn-success w-100"
            disabled={!dniOk || !formik.values.mensaje}
        >
            <FaEnvelope className="me-2" /> Enviar mensaje
        </button>
        </form>

      </div>

      <style jsx>{`
        ..form-control:disabled {
            background-color: #f9f9f9 !important;
        }
        .form-floating-label {
          position: relative;
        }
        .form-floating-label input,
        .form-floating-label textarea {
          width: 100%;
          padding: 12px 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
        }
        .form-floating-label label {
          position: absolute;
          left: 12px;
          top: 12px;
          background: white;
          padding: 0 5px;
          color: #888;
          font-size: 14px;
          transition: 0.2s ease all;
          pointer-events: none;
        }
        .form-floating-label input:focus + label,
        .form-floating-label input:not(:placeholder-shown) + label,
        .form-floating-label textarea:focus + label,
        .form-floating-label textarea:not(:placeholder-shown) + label {
          top: -8px;
          font-size: 12px;
          color: #28a745;
        }
        input:disabled {
          background: #f3f3f3 !important;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
