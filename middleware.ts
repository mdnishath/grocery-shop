import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ["/auth/login", "/auth/signup"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl;

  // ✅ 1. Redirect logged-in users away from login/signup pages
  if (PUBLIC_ROUTES.includes(url.pathname) && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } catch {
      // If token is invalid, let them continue to login/signup
    }
  }

  // ✅ 2. Redirect unauthenticated users away from /admin/*
  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

// ✅ Scope middleware to only /admin and /auth routes
export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
