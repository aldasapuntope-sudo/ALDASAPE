import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

import DOMPurify from "dompurify";
import { Editor } from "@tinymce/tinymce-react";
import config from "../../../../config";

export default function PaginaForm({ Pagina, onClose }) {
  console.log(Pagina)
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      slug: "",
      titulo: "",
      contenido: "",
      meta_titulo: "",
      meta_descripcion: "",
      imagen_destacada: "",
      is_active: 1,
    },
    validationSchema: Yup.object({
      slug: Yup.string().required("El slug es obligatorio").max(150),
      titulo: Yup.string().required("El título es obligatorio").max(255),
      meta_titulo: Yup.string().max(255, "Máximo 255 caracteres"),
      meta_descripcion: Yup.string().max(255, "Máximo 255 caracteres"),
    }),

    onSubmit: async (values) => {
      try {
        setUploading(true);
        const formData = new FormData();

        // 🔹 Campos básicos
        formData.append("slug", values.slug);
        formData.append("titulo", values.titulo);
        formData.append(
          "contenido",
          DOMPurify.sanitize(values.contenido, {
            ADD_TAGS: ["i", "span", "svg", "path"],
            ADD_ATTR: ["class", "style", "fill", "stroke", "d", "viewBox", "xmlns"],
          })
        );
        formData.append("meta_titulo", values.meta_titulo || "");
        formData.append("meta_descripcion", values.meta_descripcion || "");
        formData.append("is_active", values.is_active ? 1 : 0);

        // 🔹 Imagen (nueva o actual)
        if (file) {
          formData.append("imagen_destacada", file);
        } else if (values.imagen_destacada) {
          formData.append("imagen_actual", values.imagen_destacada);
        }

        // 🔹 Diferenciar entre Crear y Actualizar
        if (Pagina) {
          formData.append("_method", "PUT");
          await axios.post(`${config.apiUrl}api/administracion/apaginas/${Pagina.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          Swal.fire("✅ Actualizado", "La página fue actualizada correctamente", "success");
        } else {
          await axios.post(`${config.apiUrl}api/administracion/rpaginas`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          Swal.fire("✅ Guardado", "La página fue creada correctamente", "success");
        }

        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("❌ Error", "Ocurrió un error al guardar la página", "error");
      } finally {
        setUploading(false);
      }
    },
  });

  // 🔹 Cargar datos en modo edición
  useEffect(() => {
    if (Pagina) {
      formik.setValues({
        slug: Pagina.slug || "",
        titulo: Pagina.titulo || "",
        contenido: Pagina.contenido || "",
        meta_titulo: Pagina.meta_titulo || "",
        meta_descripcion: Pagina.meta_descripcion || "",
        imagen_destacada: Pagina.imagen_destacada || "",
        is_active: Pagina.is_active ?? 1,
      });

      if (Pagina.imagen_destacada) {
        setPreview(Pagina.imagen_destacada);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Pagina]);

  // 🔹 Manejo del archivo de imagen
  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(f.type)) {
      Swal.fire("Formato no permitido", "Solo se permiten PNG, JPG o WebP.", "warning");
      return;
    }

    const maxSize = 4 * 1024 * 1024; // 4MB
    if (f.size > maxSize) {
      Swal.fire("Archivo muy grande", "La imagen debe ser menor a 4MB.", "warning");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
    formik.setFieldValue("imagen_destacada", "");
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview("");
    formik.setFieldValue("imagen_destacada", "");
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0 rounded-3">
          {/* HEADER */}
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {Pagina ? "Editar Página" : "Agregar Nueva Página"}
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

          {/* FORMULARIO */}
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Slug */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    className={`form-control ${
                      formik.touched.slug && formik.errors.slug ? "is-invalid" : ""
                    }`}
                    value={formik.values.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ej: quienes-somos, contacto"
                  />
                  {formik.touched.slug && formik.errors.slug && (
                    <div className="invalid-feedback">{formik.errors.slug}</div>
                  )}
                </div>

                {/* Título */}
                <div className="col-md-6 mb-3">
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
                    placeholder="Ej: Sobre Nosotros"
                  />
                  {formik.touched.titulo && formik.errors.titulo && (
                    <div className="invalid-feedback">{formik.errors.titulo}</div>
                  )}
                </div>

                {/* Contenido (TinyMCE) */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">Contenido</label>
                  <Editor
                    apiKey="xj52mzfqyjjj5qkj7azbltcwzxa7if5ctljaqblamtvr08en"
                    value={formik.values.contenido}
                    onEditorChange={(content) => formik.setFieldValue("contenido", content)}
                    init={{
                      height: 350,
                      menubar: true,
                      plugins: [
                        "advlist autolink lists link image charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic underline | " +
                        "alignleft aligncenter alignright | bullist numlist outdent indent | " +
                        "link image media table | code | removeformat",
                      content_style: "body { font-family:Poppins, sans-serif; font-size:14px }",
                      valid_elements: "*[*],i[class|style],span[*],svg[*],path[*]",
                      branding: false,
                    }}
                  />
                  <small className="text-muted">
                    💡 Puedes usar íconos de FontAwesome, por ejemplo:{" "}
                    <code>&lt;i class='fa fa-check text-success'&gt;&lt;/i&gt;</code>
                  </small>
                </div>

                {/* Meta título */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Meta Título</label>
                  <input
                    type="text"
                    name="meta_titulo"
                    className="form-control"
                    value={formik.values.meta_titulo}
                    onChange={formik.handleChange}
                  />
                </div>

                {/* Meta descripción */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Meta Descripción</label>
                  <textarea
                    name="meta_descripcion"
                    className="form-control"
                    rows="2"
                    value={formik.values.meta_descripcion}
                    onChange={formik.handleChange}
                  ></textarea>
                </div>

                {/* Imagen destacada */}
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Imagen destacada</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                    {preview && (
                      <div style={{ width: 120 }}>
                        
                        <img
                            src={
                                preview
                                ? preview.startsWith("http")
                                    ? preview
                                    : `${config.urlserver}${preview}`
                                : "/ruta/a/imagen-default.jpg"
                            }
                            alt="preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: 80, objectFit: "cover" }}
                        />

                      </div>
                    )}
                    {(preview || formik.values.imagen_destacada) && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleRemoveImage}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <small className="text-muted d-block mt-1">
                    Tip: PNG/JPG/WebP, máximo 4MB.
                  </small>
                </div>

                {/* Estado */}
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

            {/* FOOTER */}
            <div className="modal-footer">
              <button type="submit" className="btn btn-success" disabled={uploading}>
                {uploading ? "Subiendo..." : Pagina ? "Actualizar" : "Guardar"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => onClose(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Fondo del modal */}
      <div className="modal-backdrop fade show" onClick={() => onClose(false)}></div>
    </div>
  );
}
