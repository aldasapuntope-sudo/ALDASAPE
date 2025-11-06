import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { TablaSkeleton } from "../../../../components/TablaSkeleton";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileExcel, FaFilePdf, FaSearch } from "react-icons/fa";

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

    // 📊 Agregar columna de correlativo
    const dataWithIndex = filteredData.map((item, index) => ({
      "#": index + 1,
      ...item,
    }));

    // 🧾 Nombre del reporte
    const reportTitle = `Resultado de datos de ${title || fileName.toUpperCase()}`;

    // 🧱 Crear estructura con cabecera simulada
    const headerRows = [
      [reportTitle], // primera fila: título
      [], // segunda fila: vacía (espacio)
    ];

    // 📋 Convertir datos a hoja
    const worksheet = XLSX.utils.json_to_sheet(dataWithIndex, { origin: "A3" });

    // 📎 Agregar cabecera manual
    XLSX.utils.sheet_add_aoa(worksheet, headerRows, { origin: "A1" });

    // 🧮 Ajustar ancho automático de columnas
    const columnWidths = Object.keys(dataWithIndex[0]).map((key) => ({
      wch: key.length + 10,
    }));
    worksheet["!cols"] = columnWidths;

    // 📘 Crear libro y hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

    // 💾 Descargar archivo
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

    // 🧾 Nombre del reporte
    const reportTitle = `Resultado de datos de ${title || fileName.toUpperCase()}`;

    // 📸 Insertar logo
    try {
      doc.addImage(
        "http://localhost:3000/assets/images/logo-aldasape-color.png",
        "PNG",
        40,
        20,
        160,
        50
      );
    } catch (err) {
      console.warn("No se pudo cargar el logo:", err);
    }

    // 🧾 Título centrado
    doc.setFontSize(16);
    doc.setTextColor("#00c657");
    doc.text(reportTitle, doc.internal.pageSize.getWidth() / 2, 50, {
      align: "center",
    });

    // 🧮 Agregar columna correlativa
    const tableColumn = ["#", ...columns.map((col) => col.name)];

    const tableRows = filteredData.map((row, index) => [
      index + 1, // correlativo
      ...columns.map((col) => {
        // Si col.selector es función
        if (typeof col.selector === "function") {
          const value = col.selector(row);
          return value ?? "";
        }

        // Si col.selector es string (acceso directo)
        if (typeof col.selector === "string") {
          const value = row[col.selector];
          // Evitar NaN si no existe valor o es numérico vacío
          return value !== undefined && value !== null ? value : "";
        }

        return "";
      }),
    ]);

    // 🧍 Generar tabla
    autoTable(doc, {
      startY: 90,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: {
        fillColor: [0, 198, 87],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    // 💾 Guardar
    doc.save(`${fileName}.pdf`);
  };



  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        {/* 🧾 Título y botones */}
        <div className="row mt-4">
          <div className="col-sm-6">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              {title && <h5 className="fw-bold mb-0">{title}</h5>}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm d-flex align-items-center gap-1"
                  onClick={exportToExcel}
                  title="Exportar a Excel"
                >
                  <FaFileExcel color="#ffffff" size={16} />
                  <span className="text-white">Excel</span>
                </button>

                <button
                  className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                  onClick={exportToPDF}
                  title="Exportar a PDF"
                >
                  <FaFilePdf color="#ffffff" size={16} />
                  <span className="text-white">PDF</span>
                </button>
              </div>
            </div>

          </div>

          <div className="col-sm-6">
            <div>
              <div className="position-relative w-100">
                <FaSearch
                  className="position-absolute top-50 translate-middle-y text-muted"
                  style={{ left: "10px", color: "var(--green) !important" }}
                />
                <input
                  type="text"
                  className="form-control ps-4"
                  placeholder="Buscar..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </div>

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
