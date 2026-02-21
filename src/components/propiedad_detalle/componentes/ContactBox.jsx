import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaWhatsapp, FaPhoneAlt, FaStar, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../../config";
import Cargando from "../../cargando";
import { useUsuario } from "../../../context/UserContext";

export default function ContactBox({ anuncio }) {
  const [cargando, setCargando] = useState(false);
  const { usuario } = useUsuario();
  
  const callUrl = `tel:${anuncio.perfilanunciante.telefono_movil}`;

  const formik = useFormik({
    initialValues: {
      email: usuario?.usuarioaldasa?.email || "",
      nombre: usuario?.usuarioaldasa?.nombre || "",
      telefono: usuario?.usuarioaldasa?.telefono || "",
      dni: usuario?.usuarioaldasa?.numero_documento || "",
      mensaje: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
      nombre: Yup.string().required("Tu nombre es obligatorio"),
      telefono: Yup.string()
        .matches(/^[0-9]{9}$/, "Debe tener 9 dígitos")
        .required("El teléfono es obligatorio"),
      dni: Yup.string()
        .required("El documento es obligatorio")
        .test(
          "documento-valido",
          usuario?.usuarioaldasa?.tipo_documento_id === 2
            ? "El RUC debe tener 11 dígitos"
            : "El DNI debe tener 8 dígitos",
          (value) => {
            if (!value) return false;

            const tipo = usuario?.usuarioaldasa?.tipo_documento_id;

            // DNI
            if (tipo === 1) {
              return /^[0-9]{8}$/.test(value);
            }

            // RUC
            if (tipo === 2) {
              return /^[0-9]{11}$/.test(value);
            }

            return false;
          }
        ),
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
  const formularioCompleto = dniOk && formik.values.mensaje;

  const mensajeWhatsapp = encodeURIComponent(
    `Hola, soy ${formik.values.nombre}.
  Mi teléfono es ${formik.values.telefono}.

  Estoy interesado en el anuncio:
  ${anuncio.operaciones} de ${anuncio.titulo}

  Mensaje:
  ${formik.values.mensaje}`
  );

  const whatsappUrl = `https://wa.me/${anuncio.perfilanunciante.telefono_movil}?text=${mensajeWhatsapp}`;


  return (
    <>
      <Cargando visible={cargando} />
      <div className="widget widget-contact-box d-none d-md-block mb-4">
        <h3 className="widget-subtitle">Contactar anunciante</h3>

        <div className="media d-flex align-items-center">
          <div className="flex-shrink-0">
            <div className="item-logo">
              <img
                src={
                  anuncio?.perfilanunciante?.imagen
                    ? anuncio.perfilanunciante.imagen.startsWith("http")
                      ? anuncio.perfilanunciante.imagen // 👉 Google u otra URL externa
                      : `${config.urlserver}${anuncio.perfilanunciante.imagen}` // 👉 imagen local
                    : `${config.urlserver}image/animoji-1.png`
                }
                alt={anuncio.perfilanunciante.nombre}
                width="100"
                height="100"
                className="rounded-circle"
              />

              {/*<img
                src={
                    anuncio.perfilanunciante.imagen
                    ? anuncio.perfilanunciante.imagen
                    : "/img/default-user.png"
                }
                alt={anuncio.perfilanunciante.nombre}
                width="100"
                height="100"
                className="rounded-circle"
              /> */}
            </div>
          </div>
          <div className="media-body flex-grow-1 ms-3">
            <h4 className="item-title">{anuncio.perfilanunciante.nombre}</h4>
            <div className="item-phn">
              {anuncio.perfilanunciante.telefono_movil}{" "}
              <a href={callUrl}>
                <span>(Llamar)</span>
              </a>
            </div>
            <div className="item-mail" style={{width: '240px'}}>{anuncio.perfilanunciante.email}</div>
            
          </div>
          
        </div>

        <div className="media-body flex-grow-1" style={{margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.6', textAlign: 'justify'}}>Complete el siguiente formulario para ponerse en contacto con el anunciante. Recibirá una respuesta a la brevedad posible.</div>

        
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

        {/* 🔹 BOTÓN WHATSAPP (NUEVO) */}
        <a
          href={formularioCompleto ? whatsappUrl : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="btn w-100 mt-2 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: formularioCompleto ? "#25D366" : "#ccc",
            color: "#fff",
            pointerEvents: formularioCompleto ? "auto" : "none",
          }}
        >
          <FaWhatsapp className="me-2 fs-5" />
          Contactar por WhatsApp
        </a>

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
