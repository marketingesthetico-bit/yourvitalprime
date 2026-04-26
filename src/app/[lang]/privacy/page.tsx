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
    title: s.pages.privacy.title,
    description:
      params.lang === "es"
        ? "Cómo recogemos, usamos y protegemos tus datos en YourVitalPrime."
        : "How we collect, use, and protect your data on YourVitalPrime.",
    alternates: { canonical: `/${params.lang}/privacy` },
    robots: { index: true, follow: true },
  };
}

export default function PrivacyPage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const s = getStrings(lang);
  const isEs = lang === "es";

  return (
    <>
      <PageHeader
        title={s.pages.privacy.title}
        meta={s.pages.privacy.lastUpdated}
      />
      <article className="container-prose py-14 prose-vital">
        {isEs ? <SpanishPrivacy /> : <EnglishPrivacy />}
        <p>
          {isEs ? "Para preguntas sobre privacidad, " : "For privacy questions, "}
          <Link href={`/${lang}/contact`}>
            {isEs ? "contáctanos" : "contact us"}
          </Link>
          .
        </p>
      </article>
    </>
  );
}

function EnglishPrivacy() {
  return (
    <>
      <p>
        YourVitalPrime ("we", "our", "the site") respects your privacy. This
        policy explains what we collect, why, and what you can do about it. It
        applies to <strong>yourvitalprime.com</strong> and all of its
        subdomains.
      </p>

      <h2>1. Who runs this site</h2>
      <p>
        YourVitalPrime is operated by an independent editorial team based in
        Madrid, Spain. The data controller for the purposes of the EU General
        Data Protection Regulation (GDPR) can be reached at{" "}
        <a href="mailto:hello@yourvitalprime.com">hello@yourvitalprime.com</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>We collect three categories of information:</p>
      <ul>
        <li>
          <strong>Information you give us.</strong> If you contact us or
          subscribe to our newsletter, we collect your email address and any
          message you choose to send.
        </li>
        <li>
          <strong>Information collected automatically.</strong> Our hosting
          provider and analytics tools log standard server data: IP address (in
          truncated form where possible), user agent, page URL, referrer, date
          and time. We use this for security and for understanding which
          articles are useful.
        </li>
        <li>
          <strong>Information from cookies and similar technologies.</strong>{" "}
          See section 5.
        </li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To deliver and improve the site.</li>
        <li>To send the newsletter you subscribed to (if you subscribed).</li>
        <li>To respond to messages you send us.</li>
        <li>To prevent abuse, fraud, and security issues.</li>
        <li>
          To comply with legal obligations (for example, retaining records
          where the law requires).
        </li>
      </ul>
      <p>
        Under GDPR, our legal bases are: your consent (for the newsletter and
        non-essential cookies), legitimate interest (for security and basic
        analytics), and legal obligation where applicable.
      </p>

      <h2>4. Advertising and third-party services</h2>
      <p>
        YourVitalPrime is supported by display advertising. We use{" "}
        <strong>Google AdSense</strong>, which uses cookies and similar
        technologies to serve ads based on your prior visits to this and other
        sites. You can opt out of personalised advertising by visiting{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noreferrer"
        >
          Google Ads Settings
        </a>{" "}
        or, for participating networks,{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">
          aboutads.info/choices
        </a>
        .
      </p>
      <p>
        We may also use Google Analytics 4 to understand site usage in
        aggregate. Google Analytics may set cookies on your device. We have
        configured it to anonymise IP addresses where supported.
      </p>
      <p>
        Some articles include affiliate links. Following an affiliate link may
        cause the destination merchant to set cookies. We do not control those
        cookies. We do not receive your personal information from affiliate
        partners — only aggregated commission reports.
      </p>

      <h2>5. Cookies</h2>
      <p>We use the following categories of cookies:</p>
      <ul>
        <li>
          <strong>Essential.</strong> Required for the site to work
          (preferences, security). These are always on.
        </li>
        <li>
          <strong>Analytics.</strong> Help us understand which content is
          useful. Only active with consent in regions that require it.
        </li>
        <li>
          <strong>Advertising.</strong> Used by Google AdSense and partners to
          show relevant ads. Only active with consent in regions that require
          it.
        </li>
      </ul>
      <p>
        You can refuse or revoke consent at any time using the cookie banner.
        You can also delete cookies in your browser settings.
      </p>

      <h2>6. Sharing your information</h2>
      <p>
        We do not sell your personal information. We share information only
        with: our hosting provider (Vercel), our database provider (Google
        Firebase), our analytics and advertising partners (Google), our
        newsletter provider (where applicable), and authorities when legally
        required.
      </p>

      <h2>7. International data transfers</h2>
      <p>
        Some of our service providers are based in the United States. Where we
        transfer EU/EEA personal data outside the European Economic Area, we
        rely on standard contractual clauses or other lawful transfer
        mechanisms approved by the European Commission.
      </p>

      <h2>8. Your rights</h2>
      <p>
        If you are in the EU, EEA, or UK, you have the right to: access your
        personal data; correct inaccurate data; request deletion ("right to be
        forgotten"); restrict or object to processing; data portability; and
        withdraw consent at any time.
      </p>
      <p>
        If you are in California, the CCPA and CPRA give you similar rights,
        including the right to know what we collect, to delete it, and to opt
        out of the "sale" or "sharing" of personal information. We do not sell
        your data.
      </p>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:hello@yourvitalprime.com">hello@yourvitalprime.com</a>.
        We respond within 30 days.
      </p>

      <h2>9. Data retention</h2>
      <p>
        We keep newsletter subscriber data for as long as you remain
        subscribed, plus a short cooling-off period. Server logs are retained
        for up to 12 months. Analytics data is retained for up to 14 months.
        Contact-form messages are kept for up to 24 months unless we need them
        longer for a legitimate reason.
      </p>

      <h2>10. Children</h2>
      <p>
        YourVitalPrime is intended for adults. We do not knowingly collect
        personal information from anyone under 16. If we become aware that we
        have, we will delete it promptly.
      </p>

      <h2>11. Security</h2>
      <p>
        We use industry-standard security measures (HTTPS everywhere, secure
        infrastructure, access controls). No method of transmission over the
        internet is 100% secure, but we work hard to protect your data.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date
        at the top reflects the most recent change. Material changes will be
        announced on the site.
      </p>
    </>
  );
}

function SpanishPrivacy() {
  return (
    <>
      <p>
        YourVitalPrime ("nosotros", "el sitio") respeta tu privacidad. Esta
        política explica qué recogemos, por qué y qué puedes hacer al
        respecto. Aplica a <strong>yourvitalprime.com</strong> y todos sus
        subdominios.
      </p>

      <h2>1. Quién gestiona el sitio</h2>
      <p>
        YourVitalPrime es operado por un equipo editorial independiente con
        base en Madrid, España. Para los efectos del Reglamento General de
        Protección de Datos (RGPD), el responsable del tratamiento puede
        contactarse en{" "}
        <a href="mailto:hello@yourvitalprime.com">hello@yourvitalprime.com</a>.
      </p>

      <h2>2. Información que recogemos</h2>
      <ul>
        <li>
          <strong>Información que nos das.</strong> Si nos contactas o te
          suscribes al newsletter, recogemos tu email y el mensaje que envíes.
        </li>
        <li>
          <strong>Información recogida automáticamente.</strong> Nuestro
          proveedor de hosting y herramientas de analítica registran datos
          estándar de servidor: dirección IP (truncada cuando es posible),
          navegador, URL, referente, fecha y hora.
        </li>
        <li>
          <strong>Información de cookies y tecnologías similares.</strong> Ver
          sección 5.
        </li>
      </ul>

      <h2>3. Cómo usamos tu información</h2>
      <ul>
        <li>Para ofrecer y mejorar el sitio.</li>
        <li>Para enviarte el newsletter al que te has suscrito.</li>
        <li>Para responder a tus mensajes.</li>
        <li>Para prevenir abusos, fraudes y problemas de seguridad.</li>
        <li>Para cumplir con obligaciones legales.</li>
      </ul>
      <p>
        Bajo el RGPD, nuestras bases jurídicas son: tu consentimiento (para el
        newsletter y cookies no esenciales), interés legítimo (para seguridad
        y analítica básica) y obligación legal cuando aplique.
      </p>

      <h2>4. Publicidad y servicios de terceros</h2>
      <p>
        YourVitalPrime se sostiene con publicidad. Usamos{" "}
        <strong>Google AdSense</strong>, que utiliza cookies y tecnologías
        similares para mostrar anuncios. Puedes desactivar la publicidad
        personalizada en{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noreferrer"
        >
          Configuración de anuncios de Google
        </a>
        .
      </p>
      <p>
        También podemos usar Google Analytics 4 para entender el uso del sitio
        de forma agregada.
      </p>

      <h2>5. Cookies</h2>
      <ul>
        <li>
          <strong>Esenciales.</strong> Necesarias para el funcionamiento del
          sitio. Siempre activas.
        </li>
        <li>
          <strong>Analítica.</strong> Solo activas con tu consentimiento donde
          la ley lo requiera.
        </li>
        <li>
          <strong>Publicidad.</strong> Solo activas con tu consentimiento donde
          la ley lo requiera.
        </li>
      </ul>

      <h2>6. Compartir tu información</h2>
      <p>
        No vendemos tu información personal. Solo la compartimos con: nuestro
        proveedor de hosting (Vercel), nuestro proveedor de base de datos
        (Google Firebase), nuestros socios de analítica y publicidad (Google),
        nuestro proveedor de newsletter, y autoridades cuando la ley lo exija.
      </p>

      <h2>7. Transferencias internacionales</h2>
      <p>
        Algunos proveedores están en Estados Unidos. Cuando transferimos datos
        del EEE fuera del EEE, lo hacemos mediante cláusulas contractuales
        tipo aprobadas por la Comisión Europea.
      </p>

      <h2>8. Tus derechos</h2>
      <p>
        Si estás en la UE, EEE o Reino Unido, tienes derecho a: acceder a tus
        datos, corregirlos, solicitar su eliminación, oponerte al tratamiento,
        portabilidad y retirar el consentimiento.
      </p>
      <p>
        Para ejercer cualquier derecho, escribe a{" "}
        <a href="mailto:hello@yourvitalprime.com">hello@yourvitalprime.com</a>.
        Respondemos en un plazo máximo de 30 días.
      </p>

      <h2>9. Conservación</h2>
      <p>
        Conservamos los datos del newsletter mientras estés suscrito. Los logs
        del servidor hasta 12 meses. La analítica hasta 14 meses. Los
        mensajes del formulario de contacto hasta 24 meses.
      </p>

      <h2>10. Menores</h2>
      <p>
        YourVitalPrime está dirigido a adultos. No recogemos a sabiendas datos
        de menores de 16 años.
      </p>

      <h2>11. Seguridad</h2>
      <p>Usamos HTTPS, infraestructura segura y controles de acceso.</p>

      <h2>12. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política. La fecha de actualización está al
        principio.
      </p>
    </>
  );
}
