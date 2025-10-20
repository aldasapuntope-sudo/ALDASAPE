import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
import PlanForm from "./componentes/PlanForm";

export default function PlanesList() {
  const [planes, setPlanes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlanes = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}api/planes/listar`);
      setPlanes(res.data);
    } catch (error) {
      console.error("Error al cargar los planes:", error);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  const handleAdd = () => {
    setSelectedPlan(null);
    setShowForm(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar plan?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${config.apiUrl}api/planes/${id}`);
        fetchPlanes();
        Swal.fire("Eliminado", "El plan fue eliminado correctamente.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el plan.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchPlanes();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Planes</h3>
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
                <th>Descripción</th>
                <th>Precio (S/)</th>
                <th>Duración (días)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planes.length > 0 ? (
                planes.map((plan, i) => (
                  <tr key={plan.id}>
                    <td>{i + 1}</td>
                    <td>{plan.nombre}</td>
                    <td>{plan.descripcion}</td>
                    <td>{plan.precio}</td>
                    <td>{plan.duracion_dias}</td>
                    <td>
                      <span
                        className={`badge ${
                          plan.is_active ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {plan.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(plan)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No hay planes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <PlanForm
          plan={selectedPlan}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
