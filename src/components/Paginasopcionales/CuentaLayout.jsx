import { NavLink, Outlet } from "react-router-dom";
import {
  FaRegAddressBook,
  FaHeart,
  FaBell,
  FaHistory,
} from "react-icons/fa";
import "../../css/CuentaLayout.css";

export default function CuentaLayout() {
  return (
    <div className="row">
      {/* SIDEBAR */}
      <div className="col-md-2 mb-4">
            <aside className="cuenta-sidebar">
                <NavLink
                to="/mis-contactos"
                className={({ isActive }) =>
                    `cuenta-link ${isActive ? "active" : ""}`
                }
                >
                <FaRegAddressBook />
                <span>Mis contactos</span>
                </NavLink>

                <NavLink
                to="/favoritos"
                className={({ isActive }) =>
                    `cuenta-link ${isActive ? "active" : ""}`
                }
                >
                <FaHeart />
                <span>Favoritos</span>
                </NavLink>

                <NavLink
                to="/busquedas-alertas"
                className={({ isActive }) =>
                    `cuenta-link ${isActive ? "active" : ""}`
                }
                >
                <FaBell />
                <span>Búsquedas y alertas</span>
                </NavLink>

                <NavLink
                to="/historial"
                className={({ isActive }) =>
                    `cuenta-link ${isActive ? "active" : ""}`
                }
                >
                <FaHistory />
                <span>Historial</span>
                </NavLink>
            </aside>
      </div>
      

      {/* CONTENIDO */}
      <div className="col-md-10">
            <section className="cuenta-content">
                <Outlet />
            </section>
      </div>
      
    </div>
  );
}
