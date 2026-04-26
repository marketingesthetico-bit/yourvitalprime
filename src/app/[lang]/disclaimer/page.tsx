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
    title: s.pages.disclaimer.title,
    description: s.pages.disclaimer.subtitle,
    alternates: { canonical: `/${params.lang}/disclaimer` },
  };
}

export default function DisclaimerPage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const s = getStrings(lang);
  const isEs = lang === "es";

  return (
    <>
      <PageHeader
        title={s.pages.disclaimer.title}
        subtitle={s.pages.disclaimer.subtitle}
      />

      {/* Highlight box */}
      <div className="container-prose -mt-6 mb-8">
        <div
          className="card p-6 lg:p-8"
          style={{
            backgroundColor: "var(--color-secondary-50)",
            borderColor: "var(--color-secondary)",
            borderWidth: 2,
          }}
        >
          <p
            className="m-0 text-[1.0625rem] leading-relaxed"
            style={{ color: "var(--color-text)" }}
          >
            <strong>
              {isEs
                ? "YourVitalPrime no es tu médico."
                : "YourVitalPrime is not your doctor."}
            </strong>{" "}
            {isEs
              ? "Lo que publicamos es educativo. Antes de hacer cambios en tu salud, consulta con un profesional sanitario que te conozca."
              : "What we publish is educational. Before making changes that affect your health, consult a qualified healthcare provider who knows your history."}
          </p>
        </div>
      </div>

      <article className="container-prose pb-14 prose-vital">
        {isEs ? <SpanishDisclaimer /> : <EnglishDisclaimer />}

        <p>
          {isEs
            ? "Si tienes una pregunta concreta sobre algo que has leído aquí, "
            : "If you have a specific question about something you read here, "}
          <Link href={`/${lang}/contact`}>
            {isEs ? "contáctanos" : "contact us"}
          </Link>
          .
        </p>
      </article>
    </>
  );
}

function EnglishDisclaimer() {
  return (
    <>
      <h2>What this disclaimer covers</h2>
      <p>
        This disclaimer applies to all content published on
        yourvitalprime.com — articles, newsletters, social posts, comments,
        and any other material associated with YourVitalPrime.
      </p>

      <h2>Educational content only</h2>
      <p>
        Articles on YourVitalPrime are written for general educational
        purposes and to support informed decision-making. They are{" "}
        <strong>not medical advice</strong> and should not be used as a
        substitute for the advice of a qualified healthcare professional who
        knows your individual medical history, medications, and circumstances.
      </p>

      <h2>Always consult a professional</h2>
      <p>
        Before starting, stopping, or changing any of the following, consult
        a licensed healthcare provider:
      </p>
      <ul>
        <li>Prescription medications</li>
        <li>Over-the-counter medications and supplements</li>
        <li>Diet, fasting protocols, or restrictive eating patterns</li>
        <li>Exercise programmes — especially if you have joint, heart, or chronic conditions</li>
        <li>Hormone-related interventions (HRT, TRT, peptides)</li>
        <li>Anything you read about on this site that you intend to apply to your own body</li>
      </ul>
      <p>
        If you are pregnant, nursing, taking medication, or living with a
        chronic condition, the need for professional guidance is even
        stronger.
      </p>

      <h2>Emergency situations</h2>
      <p>
        Nothing on YourVitalPrime is intended to address medical emergencies.
        If you are experiencing chest pain, severe shortness of breath, signs
        of stroke, severe injury, suicidal thoughts, or any other medical
        emergency, <strong>call your local emergency services
        immediately</strong> (112 in the EU, 911 in the US, 999 in the UK).
      </p>

      <h2>Individual results vary</h2>
      <p>
        Bodies are different. Genetics, age, sex, prior health history,
        medications, sleep, stress, and dozens of other variables shape how
        any intervention works for any one person. Outcomes described in our
        articles or in studies we cite are population-level averages, not
        guarantees for you.
      </p>

      <h2>Sources and accuracy</h2>
      <p>
        We work hard to cite credible sources (peer-reviewed studies, NIH,
        Mayo Clinic, established clinical guidelines) and to update articles
        when meaningful new evidence appears. Despite that, science changes,
        and any article may contain errors or become outdated. We welcome
        corrections — please send them to{" "}
        <a href="mailto:hello@yourvitalprime.com">hello@yourvitalprime.com</a>.
      </p>

      <h2>No client relationship</h2>
      <p>
        Reading YourVitalPrime, subscribing to our newsletter, or contacting
        us does <strong>not</strong> create a doctor-patient, coach-client,
        or fiduciary relationship. We do not provide individualised health
        recommendations.
      </p>

      <h2>Affiliate and advertising disclosures</h2>
      <p>
        Some articles include affiliate links to products or services. If you
        purchase through one, we may earn a commission at no extra cost to
        you. We also display advertising via Google AdSense and other
        networks. Neither affiliate relationships nor advertising payments
        influence our editorial judgement.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        YourVitalPrime, its operators, contributors, and affiliated parties
        are not liable for any harm, loss, or damage that may result from
        reliance on information published on this site. By using the site you
        accept this limitation.
      </p>
    </>
  );
}

function SpanishDisclaimer() {
  return (
    <>
      <h2>Qué cubre este aviso</h2>
      <p>
        Este aviso se aplica a todo el contenido publicado en
        yourvitalprime.com: artículos, newsletter, publicaciones en redes,
        comentarios y cualquier otro material asociado con YourVitalPrime.
      </p>

      <h2>Contenido educativo</h2>
      <p>
        Los artículos de YourVitalPrime se escriben con fines educativos
        generales para apoyar tu toma de decisiones informada.{" "}
        <strong>No son consejo médico</strong> y no sustituyen la atención de
        un profesional sanitario titulado que conozca tu historial, tu
        medicación y tus circunstancias.
      </p>

      <h2>Consulta siempre a un profesional</h2>
      <p>
        Antes de empezar, detener o modificar cualquiera de las siguientes
        cosas, consulta a un profesional sanitario titulado:
      </p>
      <ul>
        <li>Medicación con receta</li>
        <li>Medicamentos sin receta y suplementos</li>
        <li>Dieta, ayuno o patrones restrictivos de alimentación</li>
        <li>Programas de ejercicio — sobre todo si tienes problemas articulares, cardíacos o condiciones crónicas</li>
        <li>Intervenciones hormonales (THS, TRT, péptidos)</li>
        <li>Cualquier cosa de este sitio que pienses aplicar a tu cuerpo</li>
      </ul>
      <p>
        Si estás embarazada, en lactancia, tomando medicación o conviviendo
        con una condición crónica, la necesidad de orientación profesional es
        aún mayor.
      </p>

      <h2>Emergencias</h2>
      <p>
        Nada de lo que publicamos está pensado para emergencias médicas. Si
        sufres dolor en el pecho, dificultad severa para respirar, signos de
        ictus, lesión grave, pensamientos suicidas o cualquier otra
        emergencia, <strong>llama inmediatamente a los servicios de
        emergencia</strong> (112 en la UE).
      </p>

      <h2>Los resultados varían</h2>
      <p>
        Cada cuerpo es distinto. La genética, la edad, el sexo, el historial,
        los medicamentos, el sueño, el estrés y decenas de variables más
        condicionan cómo te afecta cualquier intervención. Los resultados que
        describimos son medias poblacionales, no garantías para ti.
      </p>

      <h2>Fuentes y precisión</h2>
      <p>
        Trabajamos con fuentes solventes (estudios revisados por pares, NIH,
        Mayo Clinic, guías clínicas establecidas) y actualizamos los
        artículos cuando aparece evidencia relevante. Aun así, la ciencia
        cambia. Si detectas un error, escríbenos a{" "}
        <a href="mailto:hello@yourvitalprime.com">hello@yourvitalprime.com</a>.
      </p>

      <h2>Sin relación profesional</h2>
      <p>
        Leer YourVitalPrime, suscribirte al newsletter o contactarnos{" "}
        <strong>no</strong> establece una relación médico-paciente,
        entrenador-cliente ni fiduciaria. No damos recomendaciones
        personalizadas.
      </p>

      <h2>Afiliación y publicidad</h2>
      <p>
        Algunos artículos incluyen enlaces de afiliación. Si compras por uno,
        podemos ganar una comisión sin coste adicional para ti. También
        mostramos publicidad mediante Google AdSense y otras redes. Ninguna
        relación de afiliación ni pago publicitario influye en nuestro
        criterio editorial.
      </p>

      <h2>Limitación de responsabilidad</h2>
      <p>
        YourVitalPrime, sus operadores, colaboradores y partes afiliadas no
        son responsables de daños o pérdidas derivados del uso de la
        información publicada en este sitio.
      </p>
    </>
  );
}
