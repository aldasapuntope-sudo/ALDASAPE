import React from "react";
import { motion } from "framer-motion";
import "../../css/TerminosCondiciones.css";
import Breadcrumb from "../../components/Breadcrumb";

export default function TerminosCondiciones() {
  return (

    <>
        
        <section className="terminos-wrap py-5">
            <Breadcrumb />
            <div className="container">
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="about-box3 bg-white rounded-4 shadow-sm p-4"
                >
                <h2 className="text-center text-success fw-bold mb-4"
                    style={{color: 'var(--green) !important'}}
                >
                    Términos y Condiciones
                </h2>

                <p className="modal-subtitulo"><strong>Información General de la Empresa</strong></p>
                <p>ALDASA INMOBILIARIA S.A.C., con RUC N° 20607274526, domicilio legal en Calle Los Amarantos #245 Urb. Santa Victoria, distrito de Chiclayo, provincia de Chiclayo y departamento de Lambayeque, con representantes legales inscritos en la Partida Electrónica N° 11352661 del Registro de Personas Jurídicas de Lambayeque. Teléfono de contacto: (+51) 947889679.</p>

                <p className="modal-subtitulo"><strong>Horario</strong></p>
                <p>EL SITIO WEB estará disponible los 365 días del año las 24 horas del día.</p>

                <p className="modal-subtitulo"><strong>Horario de servicio de atención al cliente</strong></p>
                <p>EL SITIO WEB ofrece servicio de atención al cliente mediante el correo electrónico <a href="mailto:info@aldasainmobiliaria.com">info@aldasainmobiliaria.com</a>, chat a través del fan page vía Facebook de ALDASA Inmobiliaria, al teléfono 947889679 de lunes a viernes de 9:00 a 18:00 y sábado de 9:00 a 13:00</p>

                <p className="modal-subtitulo"><strong>Datos Personales</strong></p>
                <ul className="lista-modal">
                    <li>La empresa garantiza la confidencialidad de los datos suministrados por los clientes...</li>
                    <li>De conformidad con la Ley N° 29733, Ley de Protección de Datos Personales...</li>
                    <li>Los datos personales serán incorporados a la base de datos...</li>
                    <li>Los datos se mantendrán en la base de datos mientras se consideren útiles...</li>
                    <li>El usuario podrá ejercer los derechos de acceso, rectificación, oposición y cancelación...</li>
                </ul>

                <p className="modal-subtitulo"><strong>Publicidad</strong></p>
                <p>Al suscribirse o enviar los datos desde un formulario u otro canal adherido al sitio web...</p>

                <p className="modal-subtitulo"><strong>Propiedad Intelectual</strong></p>
                <p>La propiedad intelectual, comercial e industrial del contenido, diseños y sistemas (hardware y software) son de exclusiva propiedad de LA EMPRESA...</p>

                <p className="modal-subtitulo"><strong>Responsabilidad del Usuario</strong></p>
                <p>EL USUARIO es responsable por la información que registre en EL SITIO WEB...</p>

                <p className="modal-subtitulo"><strong>Financiamiento a crédito directo</strong></p>
                <ul className="lista-modal">
                    <li>VENTAS AL CONTADO: Cuando el cliente abona el total del precio...</li>
                    <li>VENTA AL CRÉDITO: Cuando el cliente abona una inicial...</li>
                    <li>INICIAL: Según el área del lote a comprar:
                    <ul>
                        <li>90 m² a 99 m² = S/ 2000.00</li>
                        <li>100 m² a 199 m² = 20% del precio</li>
                        <li>200 m² a más = 30% del precio</li>
                    </ul>
                    </li>
                    <li>Financiamiento con crédito directo con nuestra empresa.</li>
                </ul>
                </motion.div>
            </div>
            </section>
    </>
    
  );
}
