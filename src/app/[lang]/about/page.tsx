import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteImage } from "@/components/ui/SiteImage";

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isLocale(params.lang)) return {};
  const s = getStrings(params.lang);
  return {
    title: s.pages.about.title,
    description: s.pages.about.subtitle,
    alternates: { canonical: `/${params.lang}/about` },
  };
}

export default function AboutPage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const s = getStrings(lang);
  const isEs = lang === "es";

  return (
    <>
      <PageHeader title={s.pages.about.title} subtitle={s.pages.about.subtitle} />
      <div className="container-narrow pt-10">
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <SiteImage
            name="about-detail.jpg"
            alt={
              isEs
                ? "Detalle de un escritorio editorial en Madrid: cuaderno y café"
                : "Detail of an editorial Madrid workspace: notebook and coffee"
            }
            aspect="21/9"
            placeholderLabel="Madrid"
          />
        </div>
      </div>
      <article className="container-prose py-14 prose-vital">
        {isEs ? <SpanishAbout /> : <EnglishAbout />}

        <div
          className="mt-14 p-6 rounded-2xl"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          <h3 style={{ marginTop: 0, fontSize: "1.25rem" }}>
            {isEs ? "Contáctanos" : "Get in touch"}
          </h3>
          <p style={{ marginBottom: 0 }}>
            {isEs
              ? "¿Tienes una corrección, una pregunta o un tema que quieras que cubramos? "
              : "Have a correction, a question, or a topic you'd like us to cover? "}
            <Link href={`/${lang}/contact`}>
              {isEs ? "Escríbenos." : "Send us a note."}
            </Link>
          </p>
        </div>
      </article>
    </>
  );
}

function EnglishAbout() {
  return (
    <>
      <h2>Why this site exists</h2>
      <p>
        Health information for adults over 50 is mostly written by one of two
        people: doctors who hedge every sentence into uselessness, or marketers
        selling you something. Neither of those is actually helpful when you're
        trying to figure out whether creatine is worth taking, why your sleep
        changed at 54, or what to do about the muscle you've watched slide away
        over the last decade.
      </p>
      <p>
        YourVitalPrime is the resource we wished existed. We translate research
        into plain English, name the things that don't work, and tell you what
        the evidence actually supports — at the dose that matters, for the
        decade you're in.
      </p>

      <h2>Who we write for</h2>
      <p>
        Adults 50 to 70 who've stopped chasing trends and want practical,
        evidence-based answers. People who can read a study and make their own
        call. Readers who don't need to be condescended to and don't appreciate
        being scared into a purchase.
      </p>

      <h2>How we work</h2>
      <p>
        Every article on YourVitalPrime is built the same way:
      </p>
      <ul>
        <li>
          <strong>Research first.</strong> We pull from peer-reviewed journals,
          NIH, Mayo Clinic, and other authoritative sources. We link to them so
          you can verify the claim yourself.
        </li>
        <li>
          <strong>Plain language.</strong> No jargon without explanation. No
          chest-thumping. No "miracle" anything.
        </li>
        <li>
          <strong>Real expectations.</strong> If something works modestly, we
          say so. If the evidence is mixed, we say that too.
        </li>
        <li>
          <strong>Updated when the evidence changes.</strong> Every article
          carries a "last updated" date. We revisit and revise when meaningful
          new research lands.
        </li>
      </ul>

      <h2>What we don't do</h2>
      <ul>
        <li>We don't give medical advice. We're not your doctor.</li>
        <li>
          We don't promise outcomes. Bodies are different. Genetics, history,
          and circumstance all matter.
        </li>
        <li>
          We don't pretend to be neutral about quality. Some supplements are
          worth your money. Most aren't. We'll tell you which is which.
        </li>
      </ul>

      <h2>How we make money</h2>
      <p>
        YourVitalPrime is supported by reader-friendly advertising (Google
        AdSense) and, in some articles, affiliate commissions when we recommend
        specific products. <strong>Affiliate links never determine what we
        recommend.</strong> Our coverage of a product is identical whether or
        not we earn a commission. If we don't think something works, we don't
        link to it.
      </p>

      <h2>Editorial team</h2>
      <p>
        YourVitalPrime is produced by a small editorial team based in Madrid,
        Spain. Articles are researched, drafted, and reviewed by our team
        before publication. We are not licensed medical professionals, and we
        always recommend consulting one before making changes that affect your
        health.
      </p>
      <p>
        For corrections, source requests, or partnership inquiries, see our{" "}
        <Link href="/en/contact">contact page</Link>.
      </p>
    </>
  );
}

function SpanishAbout() {
  return (
    <>
      <h2>Por qué existe este sitio</h2>
      <p>
        La información de salud para adultos de más de 50 años suele venir de
        dos sitios: médicos que matizan cada frase hasta dejarla sin utilidad,
        o gente que te quiere vender algo. Ninguno de los dos te sirve cuando
        intentas decidir si vale la pena tomar creatina, por qué te cambió el
        sueño a los 54, o qué hacer con el músculo que llevas una década
        viendo desaparecer.
      </p>
      <p>
        YourVitalPrime es el recurso que nos hubiera gustado encontrar.
        Traducimos la ciencia a un lenguaje claro, decimos lo que no funciona y
        te contamos qué respalda realmente la evidencia — a la dosis que
        importa, para la década en la que estás.
      </p>

      <h2>Para quién escribimos</h2>
      <p>
        Adultos de 50 a 70 que ya no persiguen modas y quieren respuestas
        prácticas y basadas en evidencia. Gente que sabe leer un estudio y
        decidir por sí misma. Lectores a los que no hay que tratar con
        condescendencia ni asustar para venderles algo.
      </p>

      <h2>Cómo trabajamos</h2>
      <ul>
        <li>
          <strong>Primero la investigación.</strong> Usamos revistas con
          revisión por pares, NIH, Mayo Clinic y otras fuentes solventes. Las
          enlazamos para que puedas verificar lo que decimos.
        </li>
        <li>
          <strong>Lenguaje claro.</strong> Nada de jerga sin explicar. Nada de
          "milagros".
        </li>
        <li>
          <strong>Expectativas realistas.</strong> Si algo funciona poco, lo
          decimos. Si la evidencia es mixta, también.
        </li>
        <li>
          <strong>Actualizaciones cuando cambia la ciencia.</strong> Cada
          artículo lleva fecha de actualización.
        </li>
      </ul>

      <h2>Qué no hacemos</h2>
      <ul>
        <li>No damos consejo médico. No somos tu médico.</li>
        <li>No prometemos resultados. Cada cuerpo es distinto.</li>
        <li>
          No fingimos ser neutrales sobre la calidad de los productos.
          Algunos suplementos valen lo que cuestan. La mayoría no. Te lo
          decimos.
        </li>
      </ul>

      <h2>Cómo nos financiamos</h2>
      <p>
        YourVitalPrime se sostiene con publicidad respetuosa (Google AdSense) y,
        en algunos artículos, comisiones de afiliación cuando recomendamos
        productos concretos. <strong>Las comisiones nunca determinan qué
        recomendamos.</strong> Si algo no funciona, no lo enlazamos.
      </p>

      <h2>Equipo editorial</h2>
      <p>
        YourVitalPrime lo produce un pequeño equipo editorial con base en
        Madrid. Los artículos se investigan, redactan y revisan antes de
        publicarse. No somos profesionales sanitarios titulados; recomendamos
        siempre consultar uno antes de hacer cambios que afecten tu salud.
      </p>
    </>
  );
}
