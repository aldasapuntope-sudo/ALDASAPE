import { useUsuario } from '../../context/UserContext';
import BreadcrumbALDASA from '../../cuerpos_dashboard/BreadcrumbAldasa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '../../config';// 👈 Asegúrate de que la ruta sea correcta
import Cargando from '../../components/cargando';

function Inicio() {
  const { usuario } = useUsuario();
  const nombre = usuario?.usuarioaldasa?.nombre || "Usuario";
  const [cargando, setCargando] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [publicacionesCirculacion, setPublicacionesCirculacion] = useState(0);
  const [publicacionesRevision, setPublicacionesRevision] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true); // 👈 Muestra el cargando

        // 1️⃣ Publicaciones en circulación (estado=1)
        const resCirculacion = await axios.get(
          `${config.apiUrl}api/misanuncios/listar/1/${usuario.usuarioaldasa.id}`
        );
        const dataCirculacion = resCirculacion.data;

        const favoritosAdaptados = dataCirculacion.map(item => ({
          nombre: item.titulo,
          vistas: item.visitas,
          ubicacion: item.ubicacion
        }));
        setFavoritos(favoritosAdaptados);
        setPublicacionesCirculacion(dataCirculacion.length);

        // 2️⃣ Publicaciones en revisión (estado=0)
        const resRevision = await axios.get(
          `${config.apiUrl}api/misanuncios/listar/0/${usuario.usuarioaldasa.id}`
        );
        const dataRevision = resRevision.data;
        setPublicacionesRevision(dataRevision.length);

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setCargando(false); // 👈 Oculta el cargando al finalizar
      }
    };

    if (usuario?.usuarioaldasa?.id) {
      cargarDatos();
    }
  }, [usuario]);

  return (
    <>
      <Cargando visible={cargando} /> {/* 👈 Aquí se muestra el cargando */}
      <BreadcrumbALDASA />

      <div className="container mt-4">
        {/* Row de estadísticas */}
        <div className="row g-4 mb-4">
          {/* Columna Izquierda: Gráfico */}
          <div className="col-md-8">
            <div className="bg-white rounded-4 shadow-sm p-4 h-100">
              <h5 className="fw-bold text-primary mb-3 text-center">
                Publicaciones más vistas
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={favoritos}>
                  <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vistas" fill="var(--green)" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Columna Derecha: Totales */}
          <div className="col-md-4">
            <div className="d-flex flex-column gap-3">
              {/* Tarjeta 1 */}
              <div className="bg-white rounded-4 shadow-sm p-4 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-secondary mb-1">En circulación</h6>
                  <h3 className="text-success fw-bold">{publicacionesCirculacion}</h3>
                </div>
                <FaCheckCircle size={40} className="text-success" />
              </div>

              {/* Tarjeta 2 */}
              <div className="bg-white rounded-4 shadow-sm p-4 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-secondary mb-1">En revisión</h6>
                  <h3 className="text-warning fw-bold">{publicacionesRevision}</h3>
                </div>
                <FaClock size={40} className="text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de bienvenida */}
        <div className="text-center p-5 bg-white rounded-4 shadow-sm">
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
