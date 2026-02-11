
import { useState } from "react";
import BeneficiosConstructora from "./componentes/BeneficiosConstructora";
import HeroConstructora from "./componentes/HeroConstructora";
import LlamadoAccion from "./componentes/LlamadoAccion";
import PlanesPublicacion from "./componentes/PlanesPublicacion";
import ModalContacto from "./componentes/ModalContacto";


export default function ConstructoraPage() {
  const [abrirModal, setAbrirModal] = useState(false);
  return (
    <>
      <HeroConstructora onContactar={() => setAbrirModal(true)} />
      <BeneficiosConstructora />
      <PlanesPublicacion onContactar={() => setAbrirModal(true)} />
      <LlamadoAccion onContactar={() => setAbrirModal(true)} />

      <ModalContacto
        abierto={abrirModal}
        onClose={() => setAbrirModal(false)}
      />
    </>
  );
}
