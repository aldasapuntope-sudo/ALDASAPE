import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import BreadcrumbALDASA from "../../cuerpos_dashboard/BreadcrumbAldasa";
import axios from "axios";
import config from "../../config";
import Cargando from "../../components/cargando";

const Planes = () => {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar planes desde la API
  useEffect(() => {
    const fetchPlanes = async () => {
      setCargando(true);
      try {
        const response = await axios.get(`${config.apiUrl}api/planes/listar`); // Cambia la URL a tu endpoint real
        setPlanes(response.data); // Asegúrate que la API devuelva un array de planes
      } catch (error) {
        console.error("Error al obtener planes:", error);
        Swal.fire("Error", "No se pudieron cargar los planes", "error");
      } finally {
        setCargando(false);
      }
    };

    fetchPlanes();
  }, []);

  // Cargar Culqi JS dinámicamente
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.culqi.com/js/v3";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePagoCulqui = (plan) => {
    if (!window.Culqi) {
      Swal.fire("Error", "Culqui JS aún no está cargado, espera unos segundos.", "error");
      return;
    }

    window.Culqi.publicKey = "pk_test_1234567890abcdef0123456789abcdef"; // Reemplaza con tu public key
    window.Culqi.settings({
      title: plan.nombre,
      currency: "PEN",
      description: plan.descripcion,
      amount: plan.precio,
      order_id: `plan_${plan.id}_${Date.now()}`,
    });

    window.Culqi.open();

    window.Culqi.success = function (token) {
      console.log("Token Culqi:", token);
      Swal.fire({
        icon: "success",
        title: "Pago realizado",
        text: `Tu ${plan.nombre} se activará pronto.`,
      });
      // Aquí llamarías a tu backend para confirmar el pago
    };

    window.Culqi.close = function () {
      console.log("Checkout Culqui cerrado");
    };
  };

  return (
    <>
      <BreadcrumbALDASA />
      <div className="container py-5">
        <h2 className="text-center mb-5 text-success fw-bold">Selecciona un Plan</h2>

        {cargando ? (
          <Cargando visible={cargando} />
        ) : (
          <Row className="g-4 justify-content-center">
            {planes.map((plan) => (
              <Col key={plan.id} md={4}>
                <Card className="shadow-lg border-0 rounded-4 text-center p-4 plan-card h-100">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="fw-bold text-primary mb-3 fs-3">{plan.nombre}</Card.Title>
                      <Card.Text className="fs-2 fw-bold text-success mb-3">
                        S/ {(plan.precio / 100).toFixed(2)}
                      </Card.Text>
                      <Card.Text className="text-muted mb-4">{plan.descripcion}</Card.Text>
                    </div>
                    <Button
                      variant="success"
                      className="fw-bold px-4 py-2 mt-3"
                      onClick={() => handlePagoCulqui(plan)}
                    >
                      Pagar con Culqui
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <style jsx>{`
        .plan-card:hover {
          transform: translateY(-8px);
          transition: all 0.3s ease;
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default Planes;
