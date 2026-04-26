import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/ContactForm";

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isLocale(params.lang)) return {};
  const s = getStrings(params.lang);
  return {
    title: s.pages.contact.title,
    description: s.pages.contact.subtitle,
    alternates: { canonical: `/${params.lang}/contact` },
  };
}

export default function ContactPage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const s = getStrings(lang);
  const isEs = lang === "es";

  const formStrings = isEs
    ? {
        nameLabel: "Nombre",
        emailLabel: "Email",
        topicLabel: "Asunto",
        messageLabel: "Mensaje",
        submitLabel: "Enviar mensaje",
        successTitle: "¡Recibido!",
        successBody:
          "Gracias por escribirnos. Leemos todos los mensajes y respondemos en un plazo de 3-5 días hábiles.",
        errorMessage: "Por favor revisa este campo.",
        consentLabel:
          "Acepto que mi mensaje se procese según la política de privacidad.",
        topics: [
          { value: "general", label: "Pregunta general" },
          { value: "correction", label: "Corrección de un artículo" },
          { value: "topic", label: "Sugerir un tema" },
          { value: "press", label: "Prensa o partnership" },
          { value: "privacy", label: "Privacidad / RGPD" },
        ],
      }
    : {
        nameLabel: "Name",
        emailLabel: "Email",
        topicLabel: "Topic",
        messageLabel: "Message",
        submitLabel: "Send message",
        successTitle: "Got it.",
        successBody:
          "Thanks for writing. We read every message and reply within 3-5 business days.",
        errorMessage: "Please check this field.",
        consentLabel:
          "I agree to my message being processed according to the privacy policy.",
        topics: [
          { value: "general", label: "General question" },
          { value: "correction", label: "Correction to an article" },
          { value: "topic", label: "Suggest a topic" },
          { value: "press", label: "Press or partnership" },
          { value: "privacy", label: "Privacy / GDPR request" },
        ],
      };

  return (
    <>
      <PageHeader
        title={s.pages.contact.title}
        subtitle={s.pages.contact.subtitle}
      />
      <div className="container-narrow py-14 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <aside>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {isEs ? "Otras formas" : "Other ways"}
          </h2>
          <ul
            className="space-y-4"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-soft)",
              listStyle: "none",
              padding: 0,
            }}
          >
            <li>
              <p
                className="text-sm uppercase tracking-wider mb-1"
                style={{
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                }}
              >
                Email
              </p>
              <a href="mailto:hello@yourvitalprime.com">
                hello@yourvitalprime.com
              </a>
            </li>
            <li>
              <p
                className="text-sm uppercase tracking-wider mb-1"
                style={{
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                }}
              >
                {isEs ? "Privacidad" : "Privacy"}
              </p>
              <a href="mailto:privacy@yourvitalprime.com">
                privacy@yourvitalprime.com
              </a>
            </li>
            <li>
              <p
                className="text-sm uppercase tracking-wider mb-1"
                style={{
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                }}
              >
                {isEs ? "Tiempo de respuesta" : "Response time"}
              </p>
              <p style={{ marginBottom: 0 }}>
                {isEs ? "3-5 días hábiles" : "3-5 business days"}
              </p>
            </li>
          </ul>
        </aside>
        <ContactForm strings={formStrings} />
      </div>
    </>
  );
}
