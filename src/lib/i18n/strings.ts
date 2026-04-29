import type { Locale } from "./config";

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
    "muscle-strength": { name: string; question: string; blurb: string };
    "hormonal-health": { name: string; question: string; blurb: string };
    supplementation: { name: string; question: string; blurb: string };
    longevity: { name: string; question: string; blurb: string };
    "mental-vitality": { name: string; question: string; blurb: string };
  };
  home: {
    heroDateline: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    pillarsEyebrow: string;
    pillarsTitle: string;
    pillarsSubtitle: string;
    latestEyebrow: string;
    latestTitle: string;
    latestSubtitle: string;
    letterEyebrow: string;
    letterTitle: string;
    letterBody: string;
    letterSignature: string;
    newsletterEyebrow: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
    newsletterPlaceholder: string;
    newsletterSubmit: string;
    newsletterDisclaimer: string;
    newsletterSuccessTitle: string;
    newsletterSuccessBody: string;
    trustLine: string;
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
    signature: string;
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
      blurb:
        "Sarcopenia, protein, lifting after 60. The training and nutrition that actually moves the needle when recovery isn't what it was.",
    },
    "hormonal-health": {
      name: "Hormonal Health",
      question: "Understand what's changing — and what to do.",
      blurb:
        "Perimenopause, menopause, testosterone after 50. Plain-English answers about HRT, symptoms, and the questions worth asking your doctor.",
    },
    supplementation: {
      name: "Smart Supplementation",
      question: "Which supplements actually work after 50.",
      blurb:
        "Creatine, vitamin D, omega-3, magnesium, NMN. What the evidence supports, what the dose should be, and what's not worth your money.",
    },
    longevity: {
      name: "Longevity & Biohacking",
      question: "Add healthy years, not just years.",
      blurb:
        "Healthspan over lifespan. The diet patterns, biomarkers, and lifestyle moves with the strongest evidence — and the ones still in early days.",
    },
    "mental-vitality": {
      name: "Mental Vitality",
      question: "Stay sharp. Sleep well. Feel steady.",
      blurb:
        "Brain health, sleep changes after 50, stress and cortisol. Practical guidance for staying clear-headed without becoming your own neurologist.",
    },
  },
  home: {
    heroDateline: "From the editors · Madrid",
    heroTitle: "Health, written for adults who've stopped chasing trends.",
    heroSubtitle:
      "We dig through the research, throw out what doesn't work, and write what we wish was waiting for our parents. Independent, evidence-led, no shortcuts.",
    heroCtaPrimary: "Read the latest",
    heroCtaSecondary: "What we cover",
    pillarsEyebrow: "What we write about",
    pillarsTitle: "Five questions worth answering, again and again.",
    pillarsSubtitle:
      "These are the threads we keep pulling on — because the science keeps moving, and so does your body.",
    latestEyebrow: "Recently",
    latestTitle: "From this week",
    latestSubtitle: "A new piece every two days. Nothing posted to fill space.",
    letterEyebrow: "A note from us",
    letterTitle: "Why we made this.",
    letterBody:
      "We started YourVitalPrime because we couldn't find a single resource for adults 50+ that didn't either talk down to us or sell us something. So we built the one we wished existed: rigorous, plain-spoken, and on your side. Every piece you read here was researched, written, and reviewed by our team in Madrid before it went live.",
    letterSignature: "— The editorial team",
    newsletterEyebrow: "The Thursday letter",
    newsletterTitle: "One letter, every Thursday.",
    newsletterSubtitle:
      "What we read this week, what's worth your time, what changed our mind. No spam, no tracking pixels, no five-bullet summaries.",
    newsletterPlaceholder: "your@email.com",
    newsletterSubmit: "I'm in",
    newsletterDisclaimer: "We don't share your email. Promise — and we mean it.",
    newsletterSuccessTitle: "You're in.",
    newsletterSuccessBody: "First letter lands Thursday. See you then.",
    trustLine:
      "An independent publication. Researched in Madrid, written for adults 50+. No medical advice — just what we'd want our parents to read.",
    emptyArticles:
      "Our first pieces are with the editor. Come back tomorrow.",
  },
  footer: {
    description:
      "An independent health and longevity publication for adults 50+. We translate research into plain English — and tell you when the science isn't there yet.",
    sections: {
      explore: "Read",
      legal: "Small print",
      connect: "About us",
    },
    links: {
      blog: "All articles",
      about: "Who we are",
      contact: "Write to us",
      privacy: "Privacy",
      terms: "Terms",
      disclaimer: "Medical disclaimer",
    },
    medicalDisclaimer:
      "Educational content only. Not medical advice. Always talk to a qualified healthcare provider before changing your diet, exercise, or supplement routine.",
    copyright: "© {year} YourVitalPrime",
    signature: "Made in Madrid, for the long run.",
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
      title: "Write to us",
      subtitle:
        "Corrections, questions, story ideas — every message goes to a real person on our team.",
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
    blog: "Artículos",
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
      blurb:
        "Sarcopenia, proteína, entrenamiento de fuerza después de los 60. Lo que de verdad funciona cuando la recuperación ya no es la de antes.",
    },
    "hormonal-health": {
      name: "Salud hormonal",
      question: "Entiende qué está cambiando — y qué hacer al respecto.",
      blurb:
        "Perimenopausia, menopausia, testosterona después de los 50. Respuestas claras sobre THS, síntomas y qué preguntar al médico.",
    },
    supplementation: {
      name: "Suplementación inteligente",
      question: "Qué suplementos funcionan después de los 50.",
      blurb:
        "Creatina, vitamina D, omega-3, magnesio, NMN. Qué respalda la evidencia, a qué dosis, y qué no merece tu dinero.",
    },
    longevity: {
      name: "Longevidad",
      question: "Suma años con salud, no solo años.",
      blurb:
        "Healthspan por encima de lifespan. Patrones dietéticos, biomarcadores y hábitos con más respaldo — y los que aún están verdes.",
    },
    "mental-vitality": {
      name: "Vitalidad mental",
      question: "Mantente lúcido. Duerme bien. Vive sereno.",
      blurb:
        "Salud cerebral, cambios en el sueño tras los 50, estrés y cortisol. Pautas prácticas sin convertirte en tu propio neurólogo.",
    },
  },
  home: {
    heroDateline: "Desde la redacción · Madrid",
    heroTitle: "Salud para adultos que ya no persiguen modas.",
    heroSubtitle:
      "Buceamos en la ciencia, descartamos lo que no funciona, y escribimos lo que nos hubiera gustado encontrar para nuestros padres. Independiente, basado en evidencia, sin atajos.",
    heroCtaPrimary: "Lee lo último",
    heroCtaSecondary: "Qué cubrimos",
    pillarsEyebrow: "Sobre qué escribimos",
    pillarsTitle: "Cinco preguntas que merece la pena responder una y otra vez.",
    pillarsSubtitle:
      "Son los hilos que seguimos tirando — porque la ciencia se mueve, y tu cuerpo también.",
    latestEyebrow: "Últimos",
    latestTitle: "De esta semana",
    latestSubtitle: "Un artículo nuevo cada dos días. Nada publicado por rellenar.",
    letterEyebrow: "Una nota nuestra",
    letterTitle: "Por qué hicimos esto.",
    letterBody:
      "Empezamos YourVitalPrime porque no encontrábamos un solo recurso de salud para adultos de 50+ que no nos tratara con condescendencia o intentara vendernos algo. Así que construimos el que nos hubiera gustado encontrar: riguroso, claro, y de tu lado. Cada artículo lo investiga, escribe y revisa nuestro equipo en Madrid antes de publicarse.",
    letterSignature: "— El equipo editorial",
    newsletterEyebrow: "La carta del jueves",
    newsletterTitle: "Una carta, cada jueves.",
    newsletterSubtitle:
      "Lo que hemos leído esta semana, lo que merece tu atención, lo que nos ha hecho cambiar de opinión. Sin spam, sin píxeles de seguimiento, sin resúmenes en cinco bullets.",
    newsletterPlaceholder: "tu@email.com",
    newsletterSubmit: "Apúntame",
    newsletterDisclaimer: "No compartimos tu email. En serio.",
    newsletterSuccessTitle: "Apuntado.",
    newsletterSuccessBody: "La primera carta sale este jueves. Nos vemos entonces.",
    trustLine:
      "Una publicación independiente. Investigado en Madrid, escrito para adultos de 50+. Esto no es consejo médico — es lo que querríamos para nuestros padres.",
    emptyArticles:
      "Los primeros artículos están con el editor. Vuelve mañana.",
  },
  footer: {
    description:
      "Una publicación independiente sobre salud y longevidad para adultos de 50+. Traducimos la ciencia a un lenguaje claro — y te decimos cuándo aún no la hay.",
    sections: {
      explore: "Leer",
      legal: "Letra pequeña",
      connect: "Sobre nosotros",
    },
    links: {
      blog: "Todos los artículos",
      about: "Quiénes somos",
      contact: "Escríbenos",
      privacy: "Privacidad",
      terms: "Términos",
      disclaimer: "Aviso médico",
    },
    medicalDisclaimer:
      "Contenido educativo. No es consejo médico. Habla siempre con un profesional sanitario antes de cambiar tu dieta, ejercicio o suplementación.",
    copyright: "© {year} YourVitalPrime",
    signature: "Hecho en Madrid, para el largo plazo.",
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
      title: "Escríbenos",
      subtitle:
        "Correcciones, dudas, ideas — cada mensaje lo lee una persona real del equipo.",
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
