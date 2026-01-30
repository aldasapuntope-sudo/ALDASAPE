import { createContext, useContext, useLayoutEffect, useState } from "react";
import { getMenus } from "../services/menuService";
import { getSliders } from "../services/sliderService";
import { getPrimaryColor } from "../pages/dashboard/componentes/AppConfigLoader";

const PublicDataContext = createContext();

export function PublicDataProvider({ children }) {
  const [menus, setMenus] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
  const cargar = async () => {
    try {
      const [menusRes, slidersRes, color] = await Promise.all([
        getMenus(),
        getSliders(),
        getPrimaryColor()
      ]);

      document.documentElement.style.setProperty("--green", color);

      setMenus(menusRes);
      setSliders(slidersRes);
    } catch (e) {
      console.error("Error cargando datos públicos", e);
    } finally {
      setLoading(false);
    }
  };

  cargar();
}, []);


  return (
    <PublicDataContext.Provider value={{ menus, sliders, loading }}>
      {children}
    </PublicDataContext.Provider>
  );
}

export const usePublicData = () => useContext(PublicDataContext);
