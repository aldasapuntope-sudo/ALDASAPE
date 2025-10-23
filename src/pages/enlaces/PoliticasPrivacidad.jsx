import React from "react";
import { motion } from "framer-motion";
import "../../css/TerminosCondiciones.css"; // puedes usar el mismo estilo
import Breadcrumb from "../../components/Breadcrumb";

export default function PoliticasPrivacidad() {
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
                <h2
                    className="text-center text-success fw-bold mb-4"
                    style={{ color: "var(--green) !important" }}
                >
                    Políticas de Privacidad
                </h2>

                <p className="no-margin">
                    El contenido de este sitio web es propiedad exclusiva de{" "}
                    <strong>ALDASA INMOBILIARIA S.A.C.</strong>. Las imágenes son
                    propiedad de, o se utilizan con el permiso de{" "}
                    <strong>ALDASA INMOBILIARIA S.A.C.</strong>. En caso de solicitar el
                    consentimiento de su uso, póngase en contacto con el Departamento de
                    marketing de <strong>ALDASA INMOBILIARIA S.A.C.</strong>.
                </p>

                <p>
                    <strong>ALDASA INMOBILIARIA S.A.C.</strong> no será responsable por
                    ningún daño o perjuicio derivados de su acceso a, o la imposibilidad
                    de acceder a, este sitio web o de su confianza en la información aquí
                    contenida. ALDASA INMOBILIARIA S.A.C. se exime de cualquier
                    responsabilidad por daños directos, indirectos, incidentales,
                    consecuentes, punitivos, y especiales u otros, la pérdida de
                    oportunidades, lucro cesante o cualquier otra pérdida o daño de
                    ningún tipo. Esta limitación incluye cualquier virus u otros daños
                    que puedan afectar a su equipo informático.
                </p>

                <p>
                    Su acceso y uso de este sitio web, así como el presente aviso legal
                    se regirán e interpretarán de conformidad con las leyes de la empresa
                    proveedora. Cualquier disputa que surja de o en relación con el
                    presente sitio web que no se pueda resolver de forma amistosa será
                    resuelta por los tribunales peruanos, a menos que disposiciones
                    obligatorias aplicables afirmen lo contrario.
                </p>

                <p>
                    Toda la información compartida a través de esta web será tratada de
                    conformidad con las disposiciones legales aplicables en materia de
                    protección de datos y privacidad de datos (y sus normas asociadas).
                    Tenga en cuenta que los comentarios enviados a{" "}
                    <strong>ALDASA INMOBILIARIA S.A.C.</strong> directamente con respecto
                    a este sitio web pasan a ser propiedad de{" "}
                    <strong>ALDASA INMOBILIARIA S.A.C.</strong> y pueden utilizarse sin
                    limitaciones. Tales comentarios no serán tratados de forma
                    confidencial.
                </p>
                </motion.div>
            </div>
            </section>
    </>
    
  );
}
