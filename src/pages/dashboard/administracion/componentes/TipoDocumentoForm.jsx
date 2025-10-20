import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../../config";

export default function TipoDocumentoForm({ tipo, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    is_active: 1,
  });

  useEffect(() => {
    if (tipo) setFormData(tipo);
  }, [tipo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tipo) {
        await axios.put(`${config.urlApi}tipos-documento/${tipo.id}`, formData);
        Swal.fire("Actualizado", "El tipo fue actualizado correctamente", "success");
      } else {
        await axios.post(`${config.urlApi}tipos-documento`, formData);
        Swal.fire("Guardado", "El tipo fue creado correctamente", "success");
      }
      onClose(true);
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-md modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {tipo ? "Editar Tipo de Documento" : "Agregar Tipo de Documento"}
            </h5>
            <button type="button" className="btn-close" onClick={() => onClose(false)}>
            
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
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

              <div className="mb-3">
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

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                {tipo ? "Actualizar" : "Guardar"}
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
