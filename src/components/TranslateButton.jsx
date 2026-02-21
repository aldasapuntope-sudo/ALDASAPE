import { useEffect } from "react";
import "../css/translate.css";

export default function TranslateButton() {

  useEffect(() => {
    const addScript = () => {
      if (document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "es",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    };

    addScript();
  }, []);

  const cambiarIdioma = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return;

    select.value = lang;
    select.dispatchEvent(new Event("change"));
  };

  return (
    <>
      {/* contenedor oculto de google */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* BOTON PERSONALIZADO */}
      <div className="translate-dropdown">
        <button className="translate-btn">
          🌐 Idioma
        </button>

        <div className="translate-menu">
          <button onClick={() => cambiarIdioma("es")}>Español</button>
          <button onClick={() => cambiarIdioma("en")}>English</button>
          <button onClick={() => cambiarIdioma("pt")}>Português</button>
          <button onClick={() => cambiarIdioma("fr")}>Français</button>
        </div>
      </div>
    </>
  );
}
