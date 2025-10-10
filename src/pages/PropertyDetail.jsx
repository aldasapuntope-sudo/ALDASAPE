import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'


export default function PropertyDetail(){
const { id } = useParams()
const [prop, setProp] = useState(null)


useEffect(() => {
axios.get(`${import.meta.env.VITE_API_URL}/properties/${id}`)
.then(r => setProp(r.data))
.catch(() => setProp(null))
}, [id])


if(!prop) return <div>Cargando...</div>


    return (
    <div className="bg-white rounded p-6">
    <h1 className="text-2xl font-bold">{prop.title}</h1>
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
    <div className="h-80 bg-gray-200 mb-4">
    {prop.images?.[0] ? <img src={prop.images[0]} className="w-full h-full object-cover" alt="" /> : <div className="p-8">Sin imagen</div>}
    </div>
    <p className="text-gray-700">{prop.description}</p>
    </div>
    <aside className="p-4 bg-gray-50 rounded">
    <div className="font-semibold">Precio</div>
    <div className="text-2xl text-blue-700 font-bold">S/ {prop.price}</div>
    <div className="mt-4">
    <button className="w-full py-2 bg-yellow-500 rounded text-white">Contactar</button>
    </div>
    </aside>
    </div>
    </div>
    )
}