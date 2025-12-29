import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PasosPublicar() {
  const steps = [
    {
      id: 1,
      title: "Ubica tu inmueble en el mapa",
      image: "https://urbania.pe/ecommerce/images/image-desktop-4-UBN.png",
    },
    {
      id: 2,
      title: "Cuéntanos cómo es",
      image: "https://urbania.pe/ecommerce/images/image-desktop-4-UBN.png",
    },
    {
      id: 3,
      title: "Sube fotos y videos",
      image: "https://urbania.pe/ecommerce/images/image-desktop-4-UBN.png",
    },
    {
      id: 4,
      title: "Elige un plan",
      image: "https://urbania.pe/ecommerce/images/image-desktop-4-UBN.png",
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  /* PROGRESO */
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  /* CAMBIO DE PASO (ORDENADO) */
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setProgress(0);
        setCurrentStep((prev) =>
          prev === steps.length - 1 ? 0 : prev + 1
        );
      }, 300); // pausa visual suave

      return () => clearTimeout(timeout);
    }
  }, [progress, steps.length]);

  const step = steps[currentStep];

  return (
    <section className="container py-5">
      <h2 className="text-center fw-bold mb-5">
        Publica tu inmueble en simples pasos
      </h2>

      <div className="row align-items-center">
        {/* STEPPER */}
        <div className="col-lg-6">
          {steps.map((s, index) => (
            <div key={s.id} className="d-flex align-items-center mb-4">
              <div className="step-circle-wrapper">
                {index === currentStep && (
                  <svg className="progress-ring" width="48" height="48">
                    <circle
                      stroke="#198754"
                      strokeWidth="4"
                      fill="transparent"
                      r="20"
                      cx="24"
                      cy="24"
                      style={{
                        strokeDasharray: 125.6,
                        strokeDashoffset:
                          125.6 - (125.6 * progress) / 100,
                      }}
                    />
                  </svg>
                )}
                <div
                  className={`step-circle ${
                    index === currentStep ? "active" : ""
                  }`}
                >
                  {s.id}
                </div>
              </div>

              <p
                className={`ms-3 mb-0 ${
                  index === currentStep ? "fw-bold" : "text-muted"
                }`}
              >
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* IMAGEN CON ANIMACIÓN */}
        <div className="col-lg-6 text-center">
          <img
            key={currentStep} // 🔥 fuerza re-render
            src={step.image}
            alt={step.title}
            className="img-fluid step-image fade-in"
            style={{ maxHeight: 350 }}
          />
        </div>
      </div>

      <div className="text-center mt-4">
        <Link to="/nuevo-anuncio" className="btn btn-success px-5">
          Publicar mi inmueble
        </Link>
      </div>
    </section>
  );
}
