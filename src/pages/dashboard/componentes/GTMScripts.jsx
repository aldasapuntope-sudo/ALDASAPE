import { useEffect, useState } from "react";
import config from "../../../config";

export default function GTMScripts() {
  const [scripts, setScripts] = useState(null);

  useEffect(() => {
    fetch(`${config.apiUrl}api/scripts`)
      .then(res => res.json())
      .then(data => {
        setScripts(data);

        // Insertar en el HEAD (bien)
        if (data?.script_head) {
          const headEl = document.createElement("div");
          headEl.innerHTML = data.script_head;
          document.head.appendChild(headEl);
        }
 
        // Insertar en el BODY AL INICIO
        if (data?.script_body) {
          const bodyEl = document.createElement("div");
          bodyEl.innerHTML = data.script_body;

          // Insertar justo después de <body>
          document.body.insertBefore(bodyEl, document.body.firstChild);
        }
      });
  }, []);

  return null;
}
