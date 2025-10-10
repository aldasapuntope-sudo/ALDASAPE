import React, { useEffect, useState } from 'react';
import '../css/Preloader.css';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // 2.5 segundos
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="preloader">
      <img
        src="/assets/images/favicon-aldasape.png"
        alt="ALDASA Logo"
        className="preloader-logo"
      />
    </div>
  );
}
