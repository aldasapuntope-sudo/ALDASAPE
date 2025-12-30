import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";

const faqs = [
  {
    question: "¿Cómo creo mi aviso?",
    answer:
      "Debes registrarte, iniciar sesión y hacer clic en 'Publicar mi inmueble'. Luego sigue los pasos guiados."
  },
  {
    question: "¿Cómo hago para que mi aviso tenga mejor posición en el listado?",
    answer:
      "Puedes contratar un plan de mayor exposición para que tu aviso aparezca primero en los resultados."
  },
  {
    question: "¿Cómo respondo los mensajes de los interesados?",
    answer:
      "Los mensajes llegan a tu panel de usuario y también a tu correo electrónico registrado."
  },
  {
    question: "¿Cómo paso a un plan de mayor exposición?",
    answer:
      "Desde tu panel puedes cambiar o mejorar tu plan en cualquier momento."
  },
  {
    question: "¿Cómo cancelo la renovación automática de un plan?",
    answer: (
      <>
        <p>
          Ingresa a tu perfil, ve a <strong>Mis planes</strong> y desactiva la
          renovación automática:
        </p>
        <ul>
          <li>Inicia sesión</li>
          <li>Ingresa a tu perfil</li>
          <li>Selecciona tu plan</li>
          <li>Desactiva la renovación</li>
        </ul>
      </>
    )
  }
];

export default function FaqParticular() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="container py-5">
      <h2 className="text-center fw-bold mb-2">
        Preguntas frecuentes
      </h2>
      <p className="text-center text-muted mb-5">
        Encuentra respuestas rápidas sobre cómo publicar tu inmueble
      </p>

      <div className="faq-wrapper mx-auto">
        {faqs.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className={`faq-card ${isActive ? "active" : ""}`}
              onClick={() =>
                setActiveIndex(isActive ? null : index)
              }
            >
              {/* Header */}
              <div className="faq-header">
                <h6 className="mb-0">{item.question}</h6>
                <BsChevronRight
                  className={`faq-arrow ${isActive ? "open" : ""}`}
                />
              </div>

              {/* Body */}
              <div className={`faq-body ${isActive ? "show" : ""}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
