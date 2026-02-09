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
    if (usuarioId) cargarBusquedas();
  }, [usuarioId]);

  /* =========================
     CARGAR BÚSQUEDAS
  ========================= */
  const cargarBusquedas = async () => {
    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/administracion/lbusquedas-guardadas/${usuarioId}`
      );

      setBusquedas(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error al cargar búsquedas:", error);
    } finally {
      setCargando(false);
    }
  };

 
  /* =========================
     ELIMINAR BÚSQUEDA
  ========================= */
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
      await axios.put(
        `${config.apiUrl}api/administracion/ebusquedas-guardadas/${id}`
      );

      setBusquedas((prev) => prev.filter((b) => b.id !== id));

      Swal.fire({
        icon: "success",
        title: "Búsqueda eliminada",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la búsqueda",
      });
    }
  };

  /* =========================
     EDITAR BÚSQUEDA (POPUP)
  ========================= */
  const editarBusqueda = async (busqueda) => {
    const { value: formValues } = await Swal.fire({
        title: "Editar búsqueda guardada",
        html: `
        <div class="text-start">
            <label class="form-label fw-semibold">
            Elegí un nombre para personalizar tu búsqueda
            </label>
            <input id="swal-titulo" class="form-control mb-3"
            value="${busqueda.titulo}" />

            <label class="form-label fw-semibold">Alertas</label>
            <select id="swal-alerta" class="form-select">
            <option value="sinalertas">Sin alertas</option>
            <option value="inmediata">Inmediata</option>
            <option value="diaria">Diaria</option>
            </select>
        </div>
        `,
        didOpen: () => {
        document.getElementById("swal-alerta").value =
            (busqueda.alerta || "ninguna").toLowerCase();
        },
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
        const titulo = document.getElementById("swal-titulo").value.trim();
        const alerta = document.getElementById("swal-alerta").value;

        if (!titulo) {
            Swal.showValidationMessage("El título no puede estar vacío");
            return;
        }

        return { titulo, alerta };
        },
    });

    if (!formValues) return;

    try {
        await axios.put(
        `${config.apiUrl}api/administracion/abusquedas-guardadas/${busqueda.id}`,
        formValues
        );

        setBusquedas((prev) =>
        prev.map((b) =>
            b.id === busqueda.id ? { ...b, ...formValues } : b
        )
        );

        Swal.fire({
        icon: "success",
        title: "Búsqueda actualizada",
        timer: 1400,
        showConfirmButton: false,
        });
    } catch {
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la búsqueda",
        });
    }
    };


  /* =========================
     RENDER
  ========================= */
  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <h4 className="fw-bold text-success mb-4">
          <FaBell className="me-2" /> Búsquedas y alertas
        </h4>

        {cargando ? (
          <>
            <Cargando visible />
            <CardSkeleton cards={5} />
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
                </div>

                {/* DERECHA */}
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold">Alertas</span>

                 <select
                    className="form-select form-select-sm"
                    value={(b.alerta || "sinalertas").toLowerCase()}
                    onChange={(e) =>
                        editarBusqueda({ ...b, alerta: e.target.value })
                    }
                    >
                    <option value="sinalertas">Sin alertas</option>
                    <option value="inmediata">Inmediata</option>
                    <option value="diaria">Diaria</option>
                </select>


                  <button
                    className="btn btn-outline-success rounded-circle"
                    onClick={() => editarBusqueda(b)}
                  >
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
