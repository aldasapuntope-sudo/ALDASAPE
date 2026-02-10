import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const storedUser = localStorage.getItem('usuario');
  const [usuario, setUsuario] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );

  // ✅ NUEVA FUNCIÓN: actualizar plan activo
  const actualizarPlanActivo = (planNombre) => {
    setUsuario((prev) => {
      if (!prev) return prev;

      const usuarioActualizado = {
        ...prev,
        planActivo: planNombre,
      };

      // 🔥 sincronizar con localStorage
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

      return usuarioActualizado;
    });
  };

  // Cerrar sesión
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem('usuario');
      setUsuario(updated ? JSON.parse(updated) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider
      value={{
        usuario,
        setUsuario,
        actualizarPlanActivo, // 👈 exportamos la función
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsuario = () => useContext(UserContext);
