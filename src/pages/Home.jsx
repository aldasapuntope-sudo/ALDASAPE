import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import HomeOptions from '../components/HomeOptions';
import PropertyList from '../components/PropertyList';
import FeaturedAgencies from '../components/FeaturedAgencies';
import AboutSection from '../components/AboutSection';

import { useUsuario } from '../context/UserContext';
import axios from 'axios';
import config from '../config';
import PopupPublicidad from './dashboard/componentes/PopupPublicidad';

export default function Home(){

  const { usuario } = useUsuario();
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    if (!usuario) {
      axios.get(`${config.apiUrl}api/paginaprincipal/lpopups`)
        .then(res => setPopups(res.data))
        .catch(err => console.log(err));
    }
  }, [usuario]);

  return (
    <>
      {!usuario && <PopupPublicidad popups={popups} />}

      <Hero />
      <HomeOptions />
      <PropertyList />
      <FeaturedAgencies />
      <AboutSection />
    </>
  )
}
