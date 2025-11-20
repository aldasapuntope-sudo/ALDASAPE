import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import config from "../../../../config";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function UsuarioForm({ usuario, onClose }) {
  const [perfiles, setPerfiles] = useState([]);
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const [perfRes, docRes] = await Promise.all([
          axios.get(`${config.apiUrl}api/administracion/lperfilescombox`),
          axios.get(`${config.apiUrl}api/administracion/ltipodocumentoscombox`),
        ]);

        setPerfiles(perfRes.data);
        setDocumentos(docRes.data);
      } catch (error) {
        console.error("Error combos:", error);
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      }
    };

    fetchCombos();
  }, []);

  const formik = useFormik({
    initialValues: {
      perfil_id: usuario?.perfil_id || "",
      nombre: usuario?.nombre || "",
      apellido: usuario?.apellido || "",
      razon_social: usuario?.razon_social || "",
      email: usuario?.email || "",
      password: "",
      tipo_documento_id: usuario?.tipo_documento_id || "",
      numero_documento: usuario?.numero_documento || "",
      telefono: usuario?.telefono || "",
      telefono_movil: usuario?.telefono_movil || "",
      is_active: usuario?.is_active ?? 1,
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      perfil_id: Yup.string().required("Seleccione perfil"),
      nombre: Yup.string().required("Ingrese nombre"),
      apellido: Yup.string().required("Ingrese apellido"),
      email: Yup.string().email().required("Ingrese email"),
      tipo_documento_id: Yup.string().required("Seleccione tipo"),
      numero_documento: Yup.string().required("Ingrese documento"),
    }),

    onSubmit: async (values) => {
      try {
        console.log("📤 Datos enviados al servidor:", values);
        if (usuario) {
          await axios.put(
            `${config.apiUrl}api/administracion/ausuarios/${usuario.id}`,
            values
          );
          Swal.fire("Actualizado", "Usuario actualizado con éxito", "success");
        } else {
          await axios.post(
            `${config.apiUrl}api/administracion/rusuarios`,
            values
          );
          Swal.fire("Guardado", "Usuario creado con éxito", "success");
        }
        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo guardar", "error");
      }
    },
  });

  return (
    <div className="modal show fade d-block">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {usuario ? "Editar Usuario" : "Nuevo Usuario"}
            </h5>

            <button className="btn btn-light btn-sm" onClick={() => onClose(false)}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row">

                {/* PERFIL */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Perfil</label>
                  <select
                    name="perfil_id"
                    className={`form-select ${
                      formik.touched.perfil_id && formik.errors.perfil_id
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.perfil_id}
                    onChange={formik.handleChange}
                  >
                    <option value="">Seleccione</option>
                    {perfiles.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* NOMBRE */}
                <div className="col-md-6 mb-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                  />
                </div>

                {/* APELLIDO */}
                <div className="col-md-6 mb-3">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    className="form-control"
                    value={formik.values.apellido}
                    onChange={formik.handleChange}
                  />
                </div>

                {/* EMAIL */}
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                </div>

                {/* PASSWORD */}
                <div className="col-md-6 mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder={usuario ? "Dejar vacío para no cambiar" : ""}
                  />
                </div>

                {/* TIPO DOC */}
                <div className="col-md-6 mb-3">
                  <label>Tipo documento</label>
                  <select
                    name="tipo_documento_id"
                    className="form-select"
                    value={formik.values.tipo_documento_id}
                    onChange={formik.handleChange}
                  >
                    <option value="">Seleccione</option>
                    {documentos.map((d) => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* DOCUMENTO */}
                <div className="col-md-6 mb-3">
                  <label>Número documento</label>
                  <input
                    type="text"
                    name="numero_documento"
                    className="form-control"
                    value={formik.values.numero_documento}
                    onChange={formik.handleChange}
                  />
                </div>

                {/* TELEFONO */}
                <div className="col-md-6 mb-3">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    className="form-control"
                    value={formik.values.telefono}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Teléfono móvil</label>
                  <input
                    type="text"
                    name="telefono_movil"
                    className="form-control"
                    value={formik.values.telefono_movil}
                    onChange={formik.handleChange}
                  />
                </div>

              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-success" type="submit">
                {usuario ? "Actualizar" : "Guardar"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => onClose(false)}>
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
