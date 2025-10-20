import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import TipoDocumentoForm from "./componentes/TipoDocumentoForm";
import config from "../../../config";

export default function TiposDocumentoList() {
  const [tipos, setTipos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);

  const fetchTipos = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/tipo-documento`);
      setTipos(res.data);
    } catch (error) {
      console.error("Error al cargar los tipos de documento:", error);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleAdd = () => {
    setSelectedTipo(null);
    setShowForm(true);
  };

  const handleEdit = (tipo) => {
    setSelectedTipo(tipo);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar tipo de documento?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${config.urlApi}tipos-documento/${id}`);
        fetchTipos();
        Swal.fire("Eliminado", "El tipo fue eliminado correctamente.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el tipo.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchTipos();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Tipos de Documento</h3>
        <button className="btn btn-primary" onClick={handleAdd}>
          <FaPlus className="me-2" /> Agregar nuevo
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.length > 0 ? (
                tipos.map((tipo, i) => (
                  <tr key={tipo.id}>
                    <td>{i + 1}</td>
                    <td>{tipo.nombre}</td>
                    <td>
                      <span
                        className={`badge ${
                          tipo.is_active ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {tipo.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(tipo)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(tipo.id)}
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay tipos de documento registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <TipoDocumentoForm
          tipo={selectedTipo}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
