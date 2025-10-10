import React, { useState } from 'react';
import Hero from '../components/Hero';
import HomeOptions from '../components/HomeOptions';
import PropertyList from '../components/PropertyList';
import FeaturedAgencies from '../components/FeaturedAgencies';
import AboutSection from '../components/AboutSection';


export default function Home(){
  
 
  return (
    <>
      <Hero />
      <HomeOptions />
      
      <PropertyList />
      <FeaturedAgencies />
      <AboutSection />
    </>
  )
}
