import { useEffect, useState } from "react";
import config from "../../../config";

export default function AppConfigLoader() {
  const [colorPrimario, setColorPrimario] = useState("#00c657");

  useEffect(() => {
    fetch(`${config.apiUrl}api/paginaprincipal/color`)
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data) && data.length > 0) {
          const color = data[0].valor;
          setColorPrimario(color);
          document.documentElement.style.setProperty("--green", color);
        }
      })
      .catch(err => console.error("Error al cargar configuración", err));
  }, []);

  return null;
}
