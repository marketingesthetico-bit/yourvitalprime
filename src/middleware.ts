import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "./lib/i18n/config";

/**
 * Locale routing middleware.
 * - / → /en (default locale)
 * - /xx/* where xx is unknown locale → prefix with /en/xx/*
 * - /en/*, /es/* pass through
 *
 * Excludes: /api, /_next, static assets, root files.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".") // files like /favicon.ico, /ads.txt, /sitemap.xml
  ) {
    return NextResponse.next();
  }

  const [, first, ...rest] = pathname.split("/");

  if (!first) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  if (isLocale(first)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}/${[first, ...rest].join("/")}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
