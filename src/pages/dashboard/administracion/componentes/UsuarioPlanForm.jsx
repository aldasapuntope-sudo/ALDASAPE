import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import config from "../../../../config";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function UsuarioPlanForm({ planUsuario, onClose }) {
  const [usuarios, setUsuarios] = useState([]);
  const [planes, setPlanes] = useState([]);

  // Cargar combos
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const [usuariosRes, planesRes] = await Promise.all([
          axios.get(`${config.apiUrl}api/administracion/lusuarioscombobx`),
          axios.get(`${config.apiUrl}api/administracion/lplanescombox`),
        ]);
        setUsuarios(usuariosRes.data);
        setPlanes(planesRes.data);
      } catch (error) {
        console.error("Error al cargar combos:", error);
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      }
    };
    fetchCombos();
  }, []);

  // Configurar formik
  const formik = useFormik({
    initialValues: {
      user_id: planUsuario?.user_id || "",
      plan_id: planUsuario?.plan_id || "",
      fecha_inicio: planUsuario?.fecha_inicio || "",
      fecha_fin: planUsuario?.fecha_fin || "",
      anuncios_disponibles: planUsuario?.anuncios_disponibles || 0,
      estado: planUsuario?.estado || "activo",
      is_active: planUsuario?.is_active ?? 1,
    },
    enableReinitialize: true, // 🔹 Permite recargar los datos cuando cambia planUsuario
    validationSchema: Yup.object({
      user_id: Yup.string().required("Seleccione un usuario"),
      plan_id: Yup.string().required("Seleccione un plan"),
      fecha_inicio: Yup.date().required("Ingrese fecha de inicio"),
      fecha_fin: Yup.date().required("Ingrese fecha fin"),
      anuncios_disponibles: Yup.number()
        .min(0, "Debe ser positivo")
        .required("Campo obligatorio"),
    }),
    onSubmit: async (values) => {
      try {
        if (planUsuario) {
          await axios.put(
            `${config.apiUrl}api/administracion/aplanes_usuario/${planUsuario.id}`,
            values
          );
          Swal.fire("Actualizado", "La asignación fue actualizada", "success");
        } else {
          await axios.post(
            `${config.apiUrl}api/administracion/rplanes_usuario`,
            values
          );
          Swal.fire("Guardado", "La asignación fue creada", "success");
        }
        onClose(true);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo guardar", "error");
      }
    },
  });

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header bg-primary text-white">
            <h5>{planUsuario ? "Editar Asignación" : "Asignar Plan a Usuario"}</h5>
            <button className="btn btn-light btn-sm" onClick={() => onClose(false)}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Usuario */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Usuario</label>
                  <select
                    name="user_id"
                    className={`form-select ${
                      formik.touched.user_id && formik.errors.user_id ? "is-invalid" : ""
                    }`}
                    value={formik.values.user_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Seleccione usuario</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre_completo || `${u.nombre} ${u.apellido}`}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{formik.errors.user_id}</div>
                </div>

                {/* Plan */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Plan</label>
                  <select
                    name="plan_id"
                    className={`form-select ${
                      formik.touched.plan_id && formik.errors.plan_id ? "is-invalid" : ""
                    }`}
                    value={formik.values.plan_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Seleccione plan</option>
                    {planes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{formik.errors.plan_id}</div>
                </div>

                {/* Fechas */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Fecha inicio</label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    className={`form-control ${
                      formik.touched.fecha_inicio && formik.errors.fecha_inicio
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.fecha_inicio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="invalid-feedback">{formik.errors.fecha_inicio}</div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Fecha fin</label>
                  <input
                    type="date"
                    name="fecha_fin"
                    className={`form-control ${
                      formik.touched.fecha_fin && formik.errors.fecha_fin
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.fecha_fin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="invalid-feedback">{formik.errors.fecha_fin}</div>
                </div>

                {/* Anuncios */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Anuncios disponibles</label>
                  <input
                    type="number"
                    name="anuncios_disponibles"
                    className={`form-control ${
                      formik.touched.anuncios_disponibles &&
                      formik.errors.anuncios_disponibles
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.anuncios_disponibles}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="invalid-feedback">{formik.errors.anuncios_disponibles}</div>
                </div>

                {/* Estado */}
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Estado</label>
                  <select
                    name="estado"
                    className="form-select"
                    value={formik.values.estado}
                    onChange={formik.handleChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {planUsuario ? "Actualizar" : "Guardar"}
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
