import { useState } from "react";

const faqs = [
  "¿Cómo creo mi aviso?",
  "¿Cómo hago para que mi aviso tenga mejor posición en el listado?",
  "¿Cómo respondo los mensajes de los interesados?",
  "¿Cómo paso a un plan de mayor exposición?",
  "¿Cómo cancelo la renovación automática de un plan?"
];

export default function FaqParticular() {
  const [active, setActive] = useState(null);

  return (
    <section className="container py-5">
      <h2 className="text-center fw-bold mb-4">
        Preguntas frecuentes
      </h2>

      <div className="mx-auto" style={{ maxWidth: "800px" }}>
        {faqs.map((q, index) => (
          <div
            key={index}
            className="border-bottom py-3 d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setActive(active === index ? null : index)}
          >
            <strong>{q}</strong>
            <span>{active === index ? "−" : "›"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
