import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type LangLayoutProps = {
  children: React.ReactNode;
  params: { lang: string };
};

export default function LangLayout({ children, params }: LangLayoutProps) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;

  return (
    <>
      <Header lang={lang} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
