import React, { useEffect, useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import axios from 'axios'


export default function SearchResults(){
const [results, setResults] = useState([])
const [loading, setLoading] = useState(true)


useEffect(() => {
// ejemplo: obtener desde /api/properties
axios.get(import.meta.env.VITE_API_URL + '/properties')
.then(r => setResults(r.data || []))
.catch(() => setResults([]))
.finally(() => setLoading(false))
}, [])


if(loading) return <div>Cargando propiedades...</div>


return (
<div>
<h1 className="text-xl font-semibold mb-4">Resultados de búsqueda</h1>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{results.length === 0 ? (
<div className="p-6 bg-white rounded">No se encontraron resultados</div>
) : results.map(p => <PropertyCard key={p.id} prop={p} />)}
</div>
</div>
)
}