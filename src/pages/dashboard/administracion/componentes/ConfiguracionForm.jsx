import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config";

export default function ConfiguracionForm({ ConfigItem, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      clave: "",
      valor: "",
      tipo: "texto",
      descripcion: "",
      is_active: 1,
    },
    validationSchema: Yup.object({
      clave: Yup.string().required("La clave es obligatoria").max(150),
    }),

    onSubmit: async (values) => {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("clave", values.clave);
        formData.append("tipo", values.tipo);
        formData.append("descripcion", values.descripcion);
        formData.append("is_active", values.is_active ? 1 : 0);

        if (values.tipo === "imagen" && file) {
          formData.append("valor", file);
        } else {
          formData.append("valor", values.valor);
        }

        if (ConfigItem) {
          formData.append("_method", "PUT");
          await axios.post(
            `${config.apiUrl}api/administracion/aconfiguraciones/${ConfigItem.id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          Swal.fire("✅ Actualizado", "Configuración actualizada correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/rconfiguraciones`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          Swal.fire("✅ Guardado", "Configuración creada correctamente", "success");
        }

        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("❌ Error", "Ocurrió un error al guardar la configuración", "error");
      } finally {
        setUploading(false);
      }
    },
  });

  useEffect(() => {
    if (ConfigItem) {
      formik.setValues({
        clave: ConfigItem.clave || "",
        valor: ConfigItem.valor || "",
        tipo: ConfigItem.tipo || "texto",
        descripcion: ConfigItem.descripcion || "",
        is_active: ConfigItem.is_active ?? 1,
      });
      if (ConfigItem.tipo === "imagen" && ConfigItem.valor) {
        setPreview(ConfigItem.valor);
      }
    }
  }, [ConfigItem]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(f.type)) {
      Swal.fire("Formato no permitido", "Solo PNG, JPG o WEBP.", "warning");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview("");
    formik.setFieldValue("valor", "");
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {ConfigItem ? "Editar Configuración" : "Nueva Configuración"}
            </h5>
            <button 
              type="button"
              className="btn btn-light btn-sm rounded-circle"
              onClick={() => onClose(false)}
              title="Cerrar"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Clave</label>
                  <input
                    type="text"
                    name="clave"
                    className={`form-control ${
                      formik.touched.clave && formik.errors.clave ? "is-invalid" : ""
                    }`}
                    value={formik.values.clave}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ej: telefono, correo, direccion"
                  />
                  {formik.touched.clave && formik.errors.clave && (
                    <div className="invalid-feedback">{formik.errors.clave}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Tipo</label>
                  <select
                    name="tipo"
                    className="form-select"
                    value={formik.values.tipo}
                    onChange={formik.handleChange}
                  >
                    <option value="texto">Texto</option>
                    <option value="imagen">Imagen</option>
                    <option value="color">Color</option>
                    <option value="numero">Número</option>
                    <option value="booleano">Booleano</option>
                  </select>
                </div>

                {/* Valor dinámico según tipo */}
                {formik.values.tipo === "imagen" ? (
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Imagen</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      {preview && (
                        <img
                          src={
                            preview.startsWith("http")
                              ? preview
                              : `${config.urlserver}${preview}`
                          }
                          alt="preview"
                          style={{ height: 60, borderRadius: "6px" }}
                        />
                      )}
                      {preview && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={handleRemoveImage}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Valor</label>
                    <input
                      type={
                        formik.values.tipo === "numero"
                          ? "number"
                          : formik.values.tipo === "color"
                          ? "color"
                          : "text"
                      }
                      name="valor"
                      className="form-control"
                      value={formik.values.valor}
                      onChange={formik.handleChange}
                    />
                  </div>
                )}

                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    name="descripcion"
                    className="form-control"
                    rows="2"
                    value={formik.values.descripcion}
                    onChange={formik.handleChange}
                  ></textarea>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Estado</label>
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
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success" disabled={uploading}>
                {uploading ? "Guardando..." : ConfigItem ? "Actualizar" : "Guardar"}
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
