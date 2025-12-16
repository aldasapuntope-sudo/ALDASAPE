import React from "react";
import AnunciosListclub from "./componentes/AnunciosListclub";


const AnunciosActivosclub = ({ onSelectAnuncio }) => {
  return <AnunciosListclub isPublish={1} onSelectAnuncio={onSelectAnuncio} />;
};

export default AnunciosActivosclub;
