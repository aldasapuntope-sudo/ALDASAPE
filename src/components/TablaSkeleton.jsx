import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Tabla Skeleton
export const TablaSkeleton = ({ filas = 5, columnas = 4 }) => (
  <div className="table-responsive mt-4">
    <table className="table">
      <thead>
        <tr>
          {Array.from({ length: columnas }).map((_, i) => (
            <th key={i}>
              <Skeleton height={20} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: filas }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columnas }).map((_, colIndex) => (
              <td key={colIndex}>
                <Skeleton height={20} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function SkeletonBuscarPage() {
  return (
    <section className="grid-wrap3 py-5">
      <div className="container">
        <div className="row gutters-40">
          {/* COLUMNA IZQUIERDA */}
          <div className="col-lg-4 widget-break-lg sidebar-widget mb-4 mb-lg-0">
            <div className="p-3 rounded-4 shadow-sm bg-light">
              <h5 className="mb-3">
                <span className="text-muted">
                  <ComboSkeleton width="70%" height={24} />
                </span>
              </h5>

              <ComboSkeleton />
              <ComboSkeleton />
              <ComboSkeleton />

              <AcordionSkeleton items={3} />
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="col-lg-8">
            <CardSkeleton cards={3} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Combo (Select) Skeleton
export const ComboSkeleton = ({ height = 38, width = '100%' }) => (
  <div className="form-group mt-3">
    <Skeleton height={height} width={width} />
  </div>
);

// Acordeón Skeleton
export const AcordionSkeleton = ({ items }) => (
  <div className="accordion mt-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="mb-2">
        <Skeleton height={30} width="100%" />
        <Skeleton count={2} height={15} style={{ marginTop: 8 }} />
      </div>
    ))}
  </div>
);

// Tarjeta/Carta Skeleton
export const CardSkeleton = ({ cards = 3 }) => (
  <div className="container mt-3">
    <div className="row">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="col-12 col-sm-6 col-md-4 mb-4">
          <div className="card p-3 h-100">
            <Skeleton height={150} />
            <Skeleton count={3} style={{ marginTop: 10 }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ✅ CORRECTO: Skeleton de información
export const SkeletonInformacion = () => {
  return (
    <section className="terminos-wrap py-5">
      <div className="container">
        {/* Título principal */}
        <h2 className="mb-4">
          <Skeleton height={35} width="60%" />
        </h2>

        {/* Imagen o banner simulado */}
        <div className="mb-4">
          <Skeleton height={200} className="rounded-3" />
        </div>

        {/* Párrafos simulados */}
        <div className="mb-4">
          <Skeleton count={4} height={20} style={{ marginBottom: 8 }} />
        </div>

        {/* Subtítulo */}
        <h4 className="mb-3">
          <Skeleton height={25} width="40%" />
        </h4>

        {/* Más texto */}
        <Skeleton count={6} height={18} style={{ marginBottom: 6 }} />

        {/* Lista o puntos */}
        <div className="mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="d-flex align-items-center mb-2">
              <Skeleton circle width={14} height={14} className="me-2" />
              <Skeleton height={16} width="70%" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
