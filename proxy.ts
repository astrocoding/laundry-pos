import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    if (isAuthPage) {
      if (isAuth) {
        const role = token.role as string;
        if (role === "OWNER") return NextResponse.redirect(new URL("/owner", req.url));
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
        return NextResponse.redirect(new URL("/app", req.url));
      }
      return null;
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && role !== "ADMIN" && role !== "OWNER") {
      return NextResponse.redirect(new URL("/app", req.url));
    }

    if (path.startsWith("/owner") && role !== "OWNER") {
      return NextResponse.redirect(new URL("/app", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true, // We handle redirects inside the middleware function above
    },
  }
);

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/owner/:path*", "/login", "/register"],
};
