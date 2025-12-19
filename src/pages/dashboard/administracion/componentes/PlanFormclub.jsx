import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../../config";
import { Editor } from "@tinymce/tinymce-react";
import { useFormik } from "formik";

export default function PlanFormclub({ plan, onClose }) {

  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      duracion_dias: "",
      is_active: 1,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (plan) {
          await axios.put(
            `${config.apiUrl}api/administracion/aplanesclub/${plan.id}`,
            values
          );
          Swal.fire("✅ Actualizado", "El plan fue actualizado correctamente", "success");
        } else {
          await axios.post(
            `${config.apiUrl}api/administracion/rplanesclub`,
            values
          );
          Swal.fire("✅ Guardado", "El plan fue creado correctamente", "success");
        }

        onClose(true);
      } catch (error) {
        console.error(error);
        Swal.fire("❌ Error", "Ocurrió un error al guardar el plan", "error");
      }
    },
  });

  // 🔄 Cargar datos al editar
  useEffect(() => {
    if (plan) {
      formik.setValues({
        nombre: plan.nombre || "",
        descripcion: plan.descripcion || "",
        precio: plan.precio || "",
        duracion_dias: plan.duracion_dias || "",
        is_active: plan.is_active ?? 1,
      });
    }
  }, [plan]);

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0 rounded-3">

          {/* HEADER */}
          <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title text-white">
              {plan ? "Editar Plan" : "Agregar Nuevo Plan"}
            </h5>
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

                {/* NOMBRE */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    required
                    placeholder="Ej: Plan Básico"
                  />
                </div>

                {/* PRECIO */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Precio (S/)</label>
                  <input
                    type="number"
                    name="precio"
                    step="0.01"
                    className="form-control"
                    value={formik.values.precio}
                    onChange={formik.handleChange}
                    required
                    placeholder="Ej: 49.90"
                  />
                </div>

                {/* DESCRIPCIÓN - TINYMCE */}
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <Editor
                    apiKey="xj52mzfqyjjj5qkj7azbltcwzxa7if5ctljaqblamtvr08en"
                    value={formik.values.descripcion}
                    onEditorChange={(content) =>
                      formik.setFieldValue("descripcion", content)
                    }
                    init={{
                      height: 300,
                      menubar: true,
                      plugins: [
                        "advlist autolink lists link image charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic underline | " +
                        "alignleft aligncenter alignright | bullist numlist | " +
                        "link image media table | code | removeformat",
                      content_style:
                        "body { font-family:Poppins, sans-serif; font-size:14px }",
                      branding: false,
                    }}
                  />
                </div>

                {/* DURACIÓN */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Duración (días)</label>
                  <input
                    type="number"
                    name="duracion_dias"
                    className="form-control"
                    value={formik.values.duracion_dias}
                    onChange={formik.handleChange}
                    required
                    placeholder="Ej: 30"
                  />
                </div>

                {/* ESTADO */}
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
              <button type="submit" className="btn btn-success">
                {plan ? "Actualizar" : "Guardar"}
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
      <div
        className="modal-backdrop fade show"
        onClick={() => onClose(false)}
      ></div>
    </div>
  );
}
