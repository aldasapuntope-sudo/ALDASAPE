import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaBell } from "react-icons/fa";
import Swal from "sweetalert2";

import Cargando from "../../../components/cargando";
import EmptyState from "../../EmptyState";
import { useUsuario } from "../../../context/UserContext";
import config from "../../../config";
import { CardSkeleton } from "../../TablaSkeleton";

const BusquedasAlertas = () => {
  const [busquedas, setBusquedas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const { usuario } = useUsuario();
  const usuarioId = usuario?.usuarioaldasa?.id;

  useEffect(() => {
    cargarBusquedas();
  }, [usuarioId]);

  const cargarBusquedas = async () => {
    if (!usuarioId) return;

    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/paginaprincipal/lbusquedas-guardadas/${usuarioId}`
      );

      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setBusquedas(data);
    } catch (error) {
      console.error("Error al cargar búsquedas:", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarBusqueda = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar búsqueda?",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `${config.apiUrl}api/paginaprincipal/lbusquedas-guardadas/${id}`
      );

      setBusquedas(busquedas.filter((b) => b.id !== id));

      Swal.fire({
        icon: "success",
        title: "Eliminado",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la búsqueda",
      });
    }
  };

  const cambiarAlerta = async (id, alerta) => {
    try {
      await axios.put(
        `${config.apiUrl}api/paginaprincipal/lbusquedas-guardadas/${id}`,
        { alerta }
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la alerta",
      });
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <h4 className="fw-bold text-success mb-4">
          <FaBell className="me-2" /> Búsquedas y alertas
        </h4>

        {cargando ? (
            <>
                <Cargando visible />
                <CardSkeleton cards={6} />
            </>
        ) : busquedas.length === 0 ? (
          <EmptyState
            image="/assets/images/empty-sinresult.png"
            title="No tienes búsquedas guardadas"
            description="Guarda búsquedas y recibe alertas cuando haya nuevas propiedades"
          />
        ) : (
          <div className="d-flex flex-column gap-3">
            {busquedas.map((b) => (
              <div
                key={b.id}
                className="border rounded-4 p-3 d-flex justify-content-between align-items-center"
              >
                {/* IZQUIERDA */}
                <div>
                  <h6 className="fw-bold mb-1">
                    <a href={b.url_filtro} className="text-decoration-none">
                      {b.titulo}
                    </a>
                  </h6>

                  <small className="text-muted">
                    Guardado el{" "}
                    {new Date(b.created_at).toLocaleDateString()}
                  </small>

                  {/* TAGS */}
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {(b.tags || []).map((tag, i) => (
                      <span key={i} className="badge bg-light text-dark">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DERECHA */}
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold">Alertas</span>
                    <select
                      className="form-select form-select-sm"
                      value={b.alerta}
                      onChange={(e) =>
                        cambiarAlerta(b.id, e.target.value)
                      }
                    >
                      <option value="inmediata">Inmediata</option>
                      <option value="diaria">Diaria</option>
                      <option value="semanal">Semanal</option>
                      <option value="desactivada">Desactivada</option>
                    </select>
                  </div>

                  <button className="btn btn-outline-success rounded-circle">
                    <FaEdit />
                  </button>

                  <button
                    className="btn btn-outline-danger rounded-circle"
                    onClick={() => eliminarBusqueda(b.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusquedasAlertas;
