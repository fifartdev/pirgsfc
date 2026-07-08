import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["el", "en"];
// Greek is the club's primary language: the main domain always lands on Greek.
// Visitors reach English via the in-site language switcher (/en/…).
const defaultLocale = "el";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes, and any file with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
