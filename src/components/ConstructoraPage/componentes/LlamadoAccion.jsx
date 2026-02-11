export default function LlamadoAccion({ onContactar }) {
  return (
    <section className="cta-final">
      <h2>¿Estás listo para atender prospectos y vender?</h2>

      <button className="btn-primary" onClick={onContactar}>
        Contactar a un ejecutivo
      </button>
    </section>
  );
}
