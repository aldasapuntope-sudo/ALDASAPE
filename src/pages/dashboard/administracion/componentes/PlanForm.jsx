import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../../config";

export default function PlanForm({ plan, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion_dias: "",
    is_active: 1,
  });

  useEffect(() => {
    if (plan) setFormData(plan);
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (plan) {
        await axios.put(`${config.apiUrl}planes/${plan.id}`, formData);
        Swal.fire("Actualizado", "El plan fue actualizado correctamente", "success");
      } else {
        await axios.post(`${config.apiUrl}planes`, formData);
        Swal.fire("Guardado", "El plan fue creado correctamente", "success");
      }
      onClose(true);
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {plan ? "Editar Plan" : "Agregar Plan"}
            </h5>
            <button type="button" className="btn-close" onClick={() => onClose(false)}>
              
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Precio (S/)</label>
                  <input
                    type="number"
                    name="precio"
                    step="0.01"
                    className="form-control"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    className="form-control"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Duración (días)</label>
                  <input
                    type="number"
                    name="duracion_dias"
                    className="form-control"
                    value={formData.duracion_dias}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Estado</label>
                  <select
                    name="is_active"
                    className="form-select"
                    value={formData.is_active}
                    onChange={handleChange}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {plan ? "Actualizar" : "Guardar"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => onClose(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Fondo del modal */}
      <div
        className="modal-backdrop fade show"
        onClick={() => onClose(false)}
      ></div>
    </div>
  );
}
