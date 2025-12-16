import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaLaptop, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const nombresPersonalizados = {
  'mi-perfil': 'Mi Perfil',
  'nuevo-anuncio': 'Nuevo Anuncio',
  'anuncios-revision': 'Anuncios en Revisión',
  'anuncios-activos': 'Anuncios Activos',
  'adm-planes': 'Lista de Planes',
  'adm-tdocumento': 'Lista Tipo Documentos',
  'adm-amenities': 'Lista de Servicios',
  'adm-caracteristicas': 'Lista de Características',
  'adm-operaciones': 'Lista de Operaciones',
  'adm-paginas': 'Gestión de Páginas', 
  'adm-ubicaciones': 'Gestión de Ubicaciones',
  'adm-configuraciones': 'Gestión de Configuraciones',
  'adm-tpropiedades': 'Lista Tipo Propiedades',
  'adm-bitacora': 'Bitácora del Sistema',
  'mis-favoritos': 'Mis Anuncios Favoritos',
  'adm-slider': 'Gestión de Slider',
  'adm-anunciospopups': 'Gestión de Anuncios Popups',
  'adm-popupsconfig': 'Gestión de Configuración Popups',
  'adm-usuarios': 'Gestión de Usuarios',
  'adm-scripts': 'Gestión de Scripts',
  'aldasaclub': 'Aldasa Club',
  'aldasainversioens': 'Aldasa Inversiones',
  'propiedadremates': 'Remate',
  detalle_guia: 'Detalle Guías',
  curso: 'Mis Cursos',
  detalle_curso: 'Detalle Curso',
  evaluacion: 'Evaluación Docente',
  encuestadocenteficha: 'Curso Matriculados',
  encuestadocentedetalle: 'Llenar Encuesta',
};

const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const formatearSegmento = (segmento) =>
  nombresPersonalizados[segmento]
    ? nombresPersonalizados[segmento]
    : segmento.split('_').map(capitalizar).join(' ');

const BreadcrumbALDASA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [puedeVolver, setPuedeVolver] = useState(false);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  useEffect(() => {
    setPuedeVolver(window.history.length > 1);
  }, []);

  // Página Principal
  breadcrumbs.push(
    <li key="home" className="breadcrumb-item">
      <Link to="/" style={{ color: 'hsl(0deg 0% 40%)', textDecoration: 'none' }}>
        <FaLaptop className="me-2" /> Principal
      </Link>
    </li>
  );

  let basePath = '';
  for (let i = 0; i < pathSegments.length; i++) {
    const segmento = pathSegments[i];
    const isLast = i === pathSegments.length - 1;
    const isDetalle = segmento.startsWith('detalle_');
    const siguienteSegmento = pathSegments[i + 1];
    const esVistaDetalleReal = siguienteSegmento && siguienteSegmento.length > 10;

    if (isDetalle && esVistaDetalleReal) {
      const base = segmento.replace('detalle_', '');
      breadcrumbs.push(
        <li key="detalle-id" className="breadcrumb-item active" style={{ color: 'hsl(0deg 0% 40%)', fontWeight: 'bold' }}>
          {(() => {
            try {
              const decoded = atob(atob(siguienteSegmento));
              const partes = decoded.split('|');
              return partes[partes.length - 2];
            } catch {
              return '[ID inválido]';
            }
          })()}
        </li>
      );
      break;
    }

    basePath += `/${segmento}`;
    breadcrumbs.push(
      <li
        key={segmento}
        className={`breadcrumb-item ${isLast ? 'active' : ''}`}
        style={{
          color: isLast ? 'hsl(0deg 0% 40%)' : 'rgb(102, 102, 102)',
          fontWeight: isLast ? 'bold' : 'normal',
        }}
      >
        {isLast ? (
          formatearSegmento(segmento)
        ) : (
          <Link to={basePath} style={{ color: 'rgb(102, 102, 102)' }}>
            {formatearSegmento(segmento)}
          </Link>
        )}
      </li>
    );
  }

  const { darkMode } = useTheme();
  const logo = darkMode
    ? '../assets/images/favicon-aldasape.png'
    : '../assets/images/favicon-aldasape.png';

  return (
    
    <div className="container">
      <div className="row align-items-center justify-content-between">
        <div className="col-lg-8 col-md-6 col-sm-12">
          <ul className="breadcrumb back-color-bd  rounded-4 shadow-sm">
            {breadcrumbs}
            <img alt="Logo ALDASA" className="logounjcont" src={logo} />
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default BreadcrumbALDASA;
