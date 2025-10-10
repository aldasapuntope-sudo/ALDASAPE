import React, { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setOpen(!open);

  // Cierra el menú si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={toggleMenu} className="focus:outline-none">
        <img
          alt="Perfil"
          src="/assets/images/user-default.png"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ddd",
          }}
        />
      </button>

      {open && (
        <ul
          className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg"
          style={{ zIndex: 1000 }}
        >
          <li>
            <a
              href="/mi-cuenta"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Mi cuenta
            </a>
          </li>
          <li>
            <a
              href="/mi-perfil"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Mi perfil
            </a>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("token"); // o el método que uses
                window.location.href = "/login";
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
