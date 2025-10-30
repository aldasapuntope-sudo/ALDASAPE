import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { TablaSkeleton } from "../../../../components/TablaSkeleton";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function DataTableBase({
  title,
  columns,
  data,
  actions,
  pagination = true,
  loading = false,
}) {
  const [searchText, setSearchText] = useState("");

  // 📁 Obtener nombre de la tabla desde la URL (por ejemplo "adm-caracteristicas" -> "caracteristicas")
  const currentPath = window.location.pathname;
  const fileName =
    currentPath.split("/").pop()?.replace("adm-", "").replace(/-/g, "_") ||
    "tabla";

  // 🎨 Estilos personalizados
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

  // 🧩 Agregar columna de acciones (si existe)
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

  // 🔍 Filtrado local de datos
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  // 📤 Exportar a Excel
  const exportToExcel = () => {
    if (!filteredData.length) return;
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // 📄 Exportar a PDF
  const exportToPDF = () => {
    if (!filteredData.length) return;
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    const tableColumn = columns.map((col) => col.name);
    const tableRows = filteredData.map((row) =>
      columns.map((col) =>
        typeof col.selector === "function"
          ? col.selector(row)
          : row[col.selector] ?? ""
      )
    );

    // 🧾 Encabezado del PDF
    doc.setFontSize(14);
    doc.text(title || fileName.toUpperCase(), 40, 40);

    // 🧍 Tabla
    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [200, 200, 200] },
    });

    // 💾 Guardar archivo
    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        {/* 🧾 Título y botones */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          {title && <h5 className="fw-bold mb-0">{title}</h5>}
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={exportToExcel}
              title="Exportar a Excel"
            >
              📗 Excel
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={exportToPDF}
              title="Exportar a PDF"
            >
              📕 PDF
            </button>
          </div>
        </div>

        {/* 🔍 Buscador */}
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="🔍 Buscar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* 📊 Tabla */}
        {loading ? (
          <TablaSkeleton filas={6} columnas={finalColumns.length} />
        ) : (
          <DataTable
            columns={finalColumns}
            data={filteredData}
            pagination={pagination}
            highlightOnHover
            responsive
            striped
            noDataComponent={
              <div className="text-muted py-3">
                No se encontraron resultados.
              </div>
            }
            customStyles={customStyles}
          />
        )}
      </div>
    </div>
  );
}
