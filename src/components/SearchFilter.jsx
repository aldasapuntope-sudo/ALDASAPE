import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchFilter({ mode, setMode }){
  const [tipo, setTipo] = useState('Departamento');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // crea query params y navega a la página de resultados (ejemplo /comprar)
    const target = mode === 'comprar' ? '/comprar' : mode === 'alquilar' ? '/alquilar' : '/proyectos';
    const params = new URLSearchParams({ q, tipo, mode }).toString();
    navigate(`${target}?${params}`);
  }

  return (
    <div>
      <div className="search-tabs mb-2">
        <button className={`tab-btn ${mode==='alquilar'?'active':''}`} onClick={()=>setMode('alquilar')}>Alquilar</button>
        <button className={`tab-btn ${mode==='comprar'?'active':''}`} onClick={()=>setMode('comprar')}>Comprar</button>
        <button className={`tab-btn ${mode==='proyectos'?'active':''}`} onClick={()=>setMode('proyectos')}>Proyectos</button>
      </div>

      <form className="search-box" onSubmit={handleSubmit}>
        <select className="form-select" value={tipo} onChange={e=>setTipo(e.target.value)} style={{width:160}}>
          <option>Departamento</option>
          <option>Casa</option>
          <option>Terreno</option>
          <option>Oficina</option>
        </select>

        <input className="form-control" placeholder="Ej: Chiclayo, Pomalca, Piscina" value={q} onChange={e=>setQ(e.target.value)} />

        <button className="btn btn-green" type="submit">Buscar</button>
      </form>
    </div>
  )
}
