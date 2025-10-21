import React from "react";
import DataTable from "react-data-table-component";
import { TablaSkeleton } from "../../../../components/TablaSkeleton";


export default function DataTableBase({
  title,
  columns,
  data,
  actions,
  pagination = true,
  loading = false, // 👈 nuevo prop opcional
}) {
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#ffffff",
        fontWeight: "bold",
        fontSize: "15px",
        justifyContent: "center",
      },
    },
    cells: {
      style: {
        padding: "10px",
        justifyContent: "center",
        textAlign: "center",
      },
    },
  };

  // ✅ Añadir columna de acciones (si se pasa prop actions)
  const finalColumns = actions
    ? [
        ...columns.map((col) => ({
          ...col,
          center: true,
        })),
        {
          name: "Acciones",
          cell: (row) => actions(row),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          center: true,
        },
      ]
    : columns.map((col) => ({
        ...col,
        center: true,
      }));

  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        {title && <h5 className="fw-bold mb-3 text-center">{title}</h5>}

        {loading ? (
          // ✅ Mostrar skeleton cuando está cargando
          <TablaSkeleton filas={6} columnas={finalColumns.length} />
        ) : (
          <DataTable
            columns={finalColumns}
            data={data}
            pagination={pagination}
            highlightOnHover
            responsive
            striped
            noDataComponent={<TablaSkeleton filas={6} columnas={finalColumns.length} />} // 👈 reemplaza el texto
            customStyles={customStyles}
          />
        )}
      </div>
    </div>
  );
}
