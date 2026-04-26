import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { PageHeader } from "@/components/layout/PageHeader";

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isLocale(params.lang)) return {};
  const s = getStrings(params.lang);
  return {
    title: s.pages.terms.title,
    description:
      params.lang === "es"
        ? "Las reglas para usar YourVitalPrime."
        : "The rules for using YourVitalPrime.",
    alternates: { canonical: `/${params.lang}/terms` },
  };
}

export default function TermsPage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const s = getStrings(lang);
  const isEs = lang === "es";

  return (
    <>
      <PageHeader title={s.pages.terms.title} meta={s.pages.terms.lastUpdated} />
      <article className="container-prose py-14 prose-vital">
        {isEs ? <SpanishTerms /> : <EnglishTerms />}
        <p>
          {isEs ? "¿Dudas? " : "Questions? "}
          <Link href={`/${lang}/contact`}>
            {isEs ? "Contáctanos" : "Contact us"}
          </Link>
          .
        </p>
      </article>
    </>
  );
}

function EnglishTerms() {
  return (
    <>
      <p>
        These Terms of Service ("Terms") govern your use of{" "}
        <strong>yourvitalprime.com</strong> ("the Site"). By using the Site you
        agree to these Terms. If you don't agree, please don't use the Site.
      </p>

      <h2>1. Educational content, not medical advice</h2>
      <p>
        Everything on YourVitalPrime is published for general educational
        purposes. <strong>It is not medical advice and is not a substitute for
        professional consultation, diagnosis, or treatment.</strong> Always
        consult a qualified healthcare provider before changing your diet,
        exercise, supplement, or medication regimen. See our full{" "}
        <Link href="/en/disclaimer">medical disclaimer</Link>.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 16 years old to use the Site. By using it you
        confirm that you meet this requirement.
      </p>

      <h2>3. Intellectual property</h2>
      <p>
        Articles, images, logos, and design elements on YourVitalPrime are
        protected by copyright and other intellectual property laws. You may
        share excerpts (up to ~150 words) with attribution and a link back to
        the original. Republishing entire articles without written permission
        is prohibited.
      </p>

      <h2>4. User submissions</h2>
      <p>
        If you send us a message, suggestion, or correction, you grant us a
        non-exclusive, royalty-free license to use that content to improve the
        Site. We will not publish your name or contact details without your
        consent.
      </p>

      <h2>5. Affiliate disclosure</h2>
      <p>
        Some articles contain affiliate links. If you purchase through one, we
        may earn a commission at no extra cost to you. Affiliate relationships
        never determine our editorial recommendations.
      </p>

      <h2>6. Third-party links</h2>
      <p>
        We link to external sources to help you verify our claims. We are not
        responsible for the content, accuracy, or practices of those external
        sites.
      </p>

      <h2>7. No warranties</h2>
      <p>
        The Site is provided "as is" and "as available" without warranties of
        any kind, express or implied. We do not warrant that the Site will be
        uninterrupted, error-free, or that information will be accurate or
        complete.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, YourVitalPrime, its operators,
        and contributors are not liable for any direct, indirect, incidental,
        consequential, or special damages arising from your use of the Site or
        from any decisions you make based on its content.
      </p>

      <h2>9. Changes to the Site or these Terms</h2>
      <p>
        We may update the Site and these Terms at any time. The "Last updated"
        date at the top reflects the most recent change. Continued use of the
        Site after changes constitutes acceptance of the updated Terms.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of Spain, without regard to
        conflict-of-law principles. Disputes will be subject to the
        non-exclusive jurisdiction of the courts of Madrid, Spain.
      </p>

      <h2>11. Contact</h2>
      <p>
        For questions about these Terms, email{" "}
        <a href="mailto:hello@yourvitalprime.com">hello@yourvitalprime.com</a>.
      </p>
    </>
  );
}

function SpanishTerms() {
  return (
    <>
      <p>
        Estos Términos del Servicio ("Términos") regulan tu uso de{" "}
        <strong>yourvitalprime.com</strong> ("el Sitio"). Al usar el Sitio
        aceptas estos Términos. Si no estás de acuerdo, por favor no lo uses.
      </p>

      <h2>1. Contenido educativo, no consejo médico</h2>
      <p>
        Todo lo que publica YourVitalPrime tiene fines educativos generales.{" "}
        <strong>No es consejo médico ni sustituye una consulta, diagnóstico o
        tratamiento profesional.</strong> Consulta siempre con un profesional
        sanitario antes de cambiar tu dieta, ejercicio, suplementación o
        medicación. Lee el{" "}
        <Link href="/es/disclaimer">aviso médico completo</Link>.
      </p>

      <h2>2. Edad mínima</h2>
      <p>
        Debes tener al menos 16 años para usar el Sitio. Al usarlo confirmas
        que cumples este requisito.
      </p>

      <h2>3. Propiedad intelectual</h2>
      <p>
        Los artículos, imágenes, logos y elementos de diseño están protegidos
        por copyright. Puedes compartir extractos (hasta ~150 palabras) con
        atribución y enlace al original. Republicar artículos completos sin
        permiso por escrito está prohibido.
      </p>

      <h2>4. Aportaciones de usuarios</h2>
      <p>
        Si nos envías un mensaje, sugerencia o corrección, nos concedes una
        licencia no exclusiva y libre de regalías para usar ese contenido para
        mejorar el Sitio. No publicaremos tu nombre o datos sin tu
        consentimiento.
      </p>

      <h2>5. Divulgación de afiliación</h2>
      <p>
        Algunos artículos contienen enlaces de afiliación. Si compras a través
        de ellos, podemos ganar una comisión sin coste adicional para ti. Las
        relaciones de afiliación nunca determinan nuestras recomendaciones.
      </p>

      <h2>6. Enlaces a terceros</h2>
      <p>
        Enlazamos a fuentes externas. No nos hacemos responsables de su
        contenido ni de sus prácticas.
      </p>

      <h2>7. Sin garantías</h2>
      <p>
        El Sitio se ofrece "tal cual" y "según disponibilidad", sin garantías
        de ningún tipo.
      </p>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley, YourVitalPrime no es
        responsable de daños directos, indirectos, incidentales o
        consecuenciales derivados del uso del Sitio.
      </p>

      <h2>9. Cambios</h2>
      <p>
        Podemos actualizar el Sitio y estos Términos en cualquier momento. La
        fecha de actualización está al principio. El uso continuado tras los
        cambios implica su aceptación.
      </p>

      <h2>10. Ley aplicable</h2>
      <p>
        Estos Términos se rigen por las leyes de España. Las disputas se
        someten a la jurisdicción no exclusiva de los tribunales de Madrid.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Para dudas sobre estos Términos, escribe a{" "}
        <a href="mailto:hello@yourvitalprime.com">hello@yourvitalprime.com</a>.
      </p>
    </>
  );
}
