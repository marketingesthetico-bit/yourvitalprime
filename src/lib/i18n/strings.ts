import type { Locale } from "./config";

/**
 * UI strings for layout, navigation, and shared components.
 * Article content is stored separately in Firestore.
 */

type StringSet = {
  brand: { tagline: string };
  nav: {
    home: string;
    blog: string;
    pillars: string;
    about: string;
    contact: string;
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
  };
  pillars: {
    "muscle-strength": { name: string; question: string };
    "hormonal-health": { name: string; question: string };
    supplementation: { name: string; question: string };
    longevity: { name: string; question: string };
    "mental-vitality": { name: string; question: string };
  };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    pillarsTitle: string;
    pillarsSubtitle: string;
    latestTitle: string;
    latestSubtitle: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
    newsletterPlaceholder: string;
    newsletterSubmit: string;
    newsletterDisclaimer: string;
    trustEvidence: string;
    trustReal: string;
    trustArticles: string;
    emptyArticles: string;
  };
  footer: {
    description: string;
    sections: {
      explore: string;
      legal: string;
      connect: string;
    };
    links: {
      blog: string;
      about: string;
      contact: string;
      privacy: string;
      terms: string;
      disclaimer: string;
    };
    medicalDisclaimer: string;
    copyright: string;
  };
  pages: {
    about: { title: string; subtitle: string };
    privacy: { title: string; lastUpdated: string };
    terms: { title: string; lastUpdated: string };
    contact: { title: string; subtitle: string };
    disclaimer: { title: string; subtitle: string };
  };
};

const en: StringSet = {
  brand: { tagline: "Thrive past 50. On your terms." },
  nav: {
    home: "Home",
    blog: "Blog",
    pillars: "Topics",
    about: "About",
    contact: "Contact",
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  pillars: {
    "muscle-strength": {
      name: "Muscle & Strength",
      question: "Stop losing muscle. Start gaining it back.",
    },
    "hormonal-health": {
      name: "Hormonal Health",
      question: "Understand what's changing — and what to do.",
    },
    supplementation: {
      name: "Smart Supplementation",
      question: "Which supplements actually work after 50.",
    },
    longevity: {
      name: "Longevity & Biohacking",
      question: "Add healthy years, not just years.",
    },
    "mental-vitality": {
      name: "Mental Vitality",
      question: "Stay sharp. Sleep well. Feel steady.",
    },
  },
  home: {
    heroEyebrow: "Health & longevity for adults 50+",
    heroTitle: "Thrive past 50. On your terms.",
    heroSubtitle:
      "Evidence-based guides on muscle, hormones, supplementation, and longevity — written for real adults who've stopped chasing trends.",
    heroCtaPrimary: "Read the latest",
    heroCtaSecondary: "Browse topics",
    pillarsTitle: "Five things that matter most",
    pillarsSubtitle:
      "We cover what the research actually shows about staying strong, sharp, and steady after 50.",
    latestTitle: "Latest articles",
    latestSubtitle: "New guides every two days. No fluff. No fear-mongering.",
    newsletterTitle: "One useful email a week",
    newsletterSubtitle:
      "What we're reading, what the new research says, what's worth your attention. Unsubscribe anytime.",
    newsletterPlaceholder: "your@email.com",
    newsletterSubmit: "Subscribe",
    newsletterDisclaimer: "We'll never share your email. Promise.",
    trustEvidence: "Evidence-based",
    trustReal: "Written for real adults",
    trustArticles: "New guide every 2 days",
    emptyArticles: "Our first articles are landing soon. Check back in a few days.",
  },
  footer: {
    description:
      "YourVitalPrime is an independent health and longevity resource for adults 50+. We translate research into plain English you can actually use.",
    sections: {
      explore: "Explore",
      legal: "Legal",
      connect: "About",
    },
    links: {
      blog: "All articles",
      about: "About us",
      contact: "Contact",
      privacy: "Privacy policy",
      terms: "Terms of service",
      disclaimer: "Medical disclaimer",
    },
    medicalDisclaimer:
      "Educational content only. Not medical advice. Always consult a qualified healthcare provider before changing your diet, exercise, or supplement regimen.",
    copyright: "© {year} YourVitalPrime. All rights reserved.",
  },
  pages: {
    about: {
      title: "About YourVitalPrime",
      subtitle: "Why this site exists, who's behind it, and what we promise you.",
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: April 26, 2026",
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "Last updated: April 26, 2026",
    },
    contact: {
      title: "Contact us",
      subtitle: "Questions, corrections, or feedback — we read every message.",
    },
    disclaimer: {
      title: "Medical Disclaimer",
      subtitle:
        "Read this before applying anything you find on YourVitalPrime to your own health.",
    },
  },
};

const es: StringSet = {
  brand: { tagline: "Vive a tope después de los 50. En tus términos." },
  nav: {
    home: "Inicio",
    blog: "Blog",
    pillars: "Temas",
    about: "Sobre nosotros",
    contact: "Contacto",
    skipToContent: "Saltar al contenido",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  pillars: {
    "muscle-strength": {
      name: "Músculo y fuerza",
      question: "Deja de perder músculo. Empieza a recuperarlo.",
    },
    "hormonal-health": {
      name: "Salud hormonal",
      question: "Entiende qué está cambiando — y qué hacer al respecto.",
    },
    supplementation: {
      name: "Suplementación inteligente",
      question: "Qué suplementos sí funcionan después de los 50.",
    },
    longevity: {
      name: "Longevidad y biohacking",
      question: "Suma años con salud, no solo años.",
    },
    "mental-vitality": {
      name: "Vitalidad mental",
      question: "Mantente lúcido. Duerme bien. Vive sereno.",
    },
  },
  home: {
    heroEyebrow: "Salud y longevidad para adultos de 50+",
    heroTitle: "Vive a tope después de los 50. En tus términos.",
    heroSubtitle:
      "Guías basadas en evidencia sobre músculo, hormonas, suplementación y longevidad — escritas para adultos reales que ya no persiguen modas.",
    heroCtaPrimary: "Lee lo último",
    heroCtaSecondary: "Explorar temas",
    pillarsTitle: "Cinco cosas que importan más",
    pillarsSubtitle:
      "Cubrimos lo que la ciencia dice realmente sobre mantenerse fuerte, lúcido y sereno después de los 50.",
    latestTitle: "Últimos artículos",
    latestSubtitle: "Nuevas guías cada dos días. Sin paja. Sin alarmismo.",
    newsletterTitle: "Un email útil a la semana",
    newsletterSubtitle:
      "Lo que estamos leyendo, lo que dice la ciencia nueva, lo que merece tu atención. Cancela cuando quieras.",
    newsletterPlaceholder: "tu@email.com",
    newsletterSubmit: "Suscribirme",
    newsletterDisclaimer: "Nunca compartiremos tu email. Palabra.",
    trustEvidence: "Basado en evidencia",
    trustReal: "Escrito para adultos reales",
    trustArticles: "Guía nueva cada 2 días",
    emptyArticles: "Nuestros primeros artículos llegan pronto. Vuelve en unos días.",
  },
  footer: {
    description:
      "YourVitalPrime es un recurso independiente de salud y longevidad para adultos de 50+. Traducimos la ciencia a un lenguaje claro que puedes aplicar.",
    sections: {
      explore: "Explorar",
      legal: "Legal",
      connect: "Acerca de",
    },
    links: {
      blog: "Todos los artículos",
      about: "Sobre nosotros",
      contact: "Contacto",
      privacy: "Política de privacidad",
      terms: "Términos del servicio",
      disclaimer: "Aviso médico",
    },
    medicalDisclaimer:
      "Contenido educativo. No es consejo médico. Consulta siempre con un profesional sanitario antes de cambiar tu dieta, ejercicio o suplementación.",
    copyright: "© {year} YourVitalPrime. Todos los derechos reservados.",
  },
  pages: {
    about: {
      title: "Sobre YourVitalPrime",
      subtitle: "Por qué existe este sitio, quién está detrás y qué te prometemos.",
    },
    privacy: {
      title: "Política de privacidad",
      lastUpdated: "Última actualización: 26 de abril de 2026",
    },
    terms: {
      title: "Términos del servicio",
      lastUpdated: "Última actualización: 26 de abril de 2026",
    },
    contact: {
      title: "Contáctanos",
      subtitle: "Dudas, correcciones o feedback — leemos todos los mensajes.",
    },
    disclaimer: {
      title: "Aviso médico",
      subtitle:
        "Léelo antes de aplicar a tu salud cualquier cosa que encuentres en YourVitalPrime.",
    },
  },
};

const dictionaries: Record<Locale, StringSet> = { en, es };

export function getStrings(lang: Locale): StringSet {
  return dictionaries[lang] ?? dictionaries.en;
}

export type { StringSet };
