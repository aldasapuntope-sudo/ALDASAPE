import React from 'react'


export default function Admin(){
    return (
    <div className="bg-white rounded p-6">
    <h1 className="text-2xl font-bold">Panel de administración</h1>
    <p className="mt-4">Aquí podrás iniciar sesión y administrar propiedades (esqueleto).</p>
    <div className="mt-6">
    <button className="px-4 py-2 bg-blue-700 text-white rounded">Agregar propiedad</button>
    </div>
    </div>
    )
}