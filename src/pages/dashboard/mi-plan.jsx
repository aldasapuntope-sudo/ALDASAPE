import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import { useUsuario } from "../../context/UserContext";
import Cargando from "../../components/cargando";
import { SkeletonInformacion } from "../../components/TablaSkeleton";
import config from "../../config";
import BreadcrumbALDASA from "../../cuerpos_dashboard/BreadcrumbAldasa";
import EmptyState from "../../components/EmptyState";

export default function MiPlan() {
  const { usuario } = useUsuario();
  const [plan, setPlan] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario?.usuarioaldasa?.id) return;
    cargarPlan();
  }, [usuario]);

  const cargarPlan = async () => {
    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/planes/usuario/${usuario.usuarioaldasa.id}`
      );

      if (res.data?.original?.tiene_plan) {
        setPlan(res.data.original.plan);
      } else {
        setPlan(null);
      }
    } catch (error) {
      console.error("Error al obtener plan:", error);
      setPlan(null);
    } finally {
      setCargando(false);
    }
  };

  // 🦴 Skeleton mientras carga
  if (cargando) {
    return <SkeletonInformacion />;
  }

  // 📅 Cálculo de días restantes
  const hoy = new Date();
  const fechaFin = plan ? new Date(plan.fecha_fin) : null;

  const diasRestantes = plan
    ? Math.max(
        Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24)),
        0
      )
    : 0;

  return (
    <>
      <Cargando visible={false} />
    
      <BreadcrumbALDASA />
        
      <div className="container mt-4">
        {!plan ? (
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-4">
              
                <EmptyState
                    image="/assets/images/empty-sinresult.png"
                    title="No tienes un plan activo"
                    description="Contrata un plan para publicar anuncios."
                              
                />
            </Card.Body>
          </Card>
        ) : (
          <>
            {/* 🔹 CARD PLAN */}
            <Card className="shadow border-0 mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Mi Plan Activo</h4>

                  <span
                    style={{
                      background: "var(--green)",
                      color: "#fff",
                      padding: "6px 18px",
                      borderRadius: "50px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {plan.nombre}
                  </span>
                </div>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div className="p-3 border rounded">
                      <small className="text-muted">Estado</small>
                      <div className="fw-semibold">
                        {plan.is_active ? (
                          <span className="text-success">Activo</span>
                        ) : (
                          <span className="text-danger">Inactivo</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 border rounded">
                      <small className="text-muted">Anuncios disponibles</small>
                      <div className="fw-semibold">
                        {plan.anuncios_disponibles}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 border rounded">
                      <small className="text-muted">Fecha inicio</small>
                      <div className="fw-semibold">
                        {new Date(plan.fecha_inicio).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 border rounded">
                      <small className="text-muted">Fecha vencimiento</small>
                      <div className="fw-semibold">
                        {new Date(plan.fecha_fin).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted">Precio del plan</small>
                      <div className="fw-bold fs-5 text-success">
                        S/ {Number(plan.precio).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  {plan.descripcion && (
                    <div className="col-12">
                        <div className="p-3 border rounded">
                        <small className="text-muted d-block mb-2">
                            Descripción del plan
                        </small>

                        <div
                            className="text-muted"
                            style={{ fontSize: "14px", lineHeight: "1.6" }}
                            dangerouslySetInnerHTML={{ __html: plan.descripcion }}
                        />
                        </div>
                    </div>
                    )}
                </div>
              </Card.Body>
            </Card>

            {/* 🔹 CARD DÍAS RESTANTES */}
            <Card
              className={`shadow border-0 ${
                diasRestantes <= 5 ? "border-danger" : ""
              }`}
            >
              <Card.Body className="text-center">
                <small className="text-muted d-block mb-1">
                  Días restantes del plan
                </small>

                <div
                  className={`fw-bold display-6 ${
                    diasRestantes === 0
                      ? "text-danger"
                      : diasRestantes <= 5
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {diasRestantes}
                </div>

                {diasRestantes === 0 && (
                  <small className="text-danger">
                    Tu plan ha vencido
                  </small>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
