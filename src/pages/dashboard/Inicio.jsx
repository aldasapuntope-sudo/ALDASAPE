import { useUsuario } from '../../context/UserContext';
import BreadcrumbALDASA from '../../cuerpos_dashboard/BreadcrumbAldasa';

function Inicio() {
  const { usuario } = useUsuario();
  const nombre = usuario?.usuarioaldasa?.nombre || "Usuario";

  return (
    <>
      <BreadcrumbALDASA />

      <div className="container mt-4 text-center">
        <div className="p-5 bg-white rounded-4 shadow-sm">
          <img
            src="assets/images/logo-aldasape-color.png"
            alt="Aldasa Logo"
            style={{ width: '120px', marginBottom: '20px' }}
          />

          <h2 className="fw-bold text-success">
            ¡Bienvenido(a), {nombre}!
          </h2>

          <p className="mt-3 text-muted fs-5">
            Nos alegra tenerte en <strong>ALDASA</strong>, tu portal digital de gestión y servicios.
          </p>

          <hr className="my-4" />

          <p className="text-secondary">
            Desde aquí podrás acceder fácilmente a tus herramientas, reportes y secciones personalizadas.
            Explora el menú lateral para gestionar tus actividades y mantenerte al día con las últimas novedades.
          </p>

          
        </div>
      </div>
    </>
  );
}

export default Inicio;
