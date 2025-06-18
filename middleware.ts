import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "./services/get-token";

export async function middleware(req: NextRequest) {
  const { user, authToken, isLogged } = await getAuth();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/dashboard")) {
    if (!isLogged || user.role !== "admin") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
