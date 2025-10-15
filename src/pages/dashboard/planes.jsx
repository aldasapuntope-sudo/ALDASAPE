import React, { useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import BreadcrumbALDASA from "../../cuerpos_dashboard/BreadcrumbAldasa";

const planes = [
  { id: 1, nombre: "Plan Básico", precio: 1990, descripcion: "Publica 1 anuncio durante 30 días." },
  { id: 2, nombre: "Plan Profesional", precio: 3990, descripcion: "Publica hasta 5 anuncios durante 60 días." },
  { id: 3, nombre: "Plan Premium", precio: 7990, descripcion: "Publica anuncios ilimitados durante 90 días." },
];

const Planes = () => {
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

    window.Culqi.publicKey = "TU_PUBLIC_KEY_DE_CULQUI"; // Reemplaza con tu public key
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
      // Aquí llama a tu backend para confirmar el pago
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

        <Row className="g-4 justify-content-center">
          {planes.map((plan) => (
            <Col key={plan.id} md={4}>
              <Card className="shadow-lg border-0 rounded-4 text-center p-4 plan-card h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-bold text-primary mb-3 fs-3">{plan.nombre}</Card.Title>
                    <Card.Text className="fs-2 fw-bold text-success mb-3">S/ {(plan.precio / 100).toFixed(2)}</Card.Text>
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
