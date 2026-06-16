import { NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/auth";
import {
  getRequiredPermission,
  hasPermission,
  parsePermissionsCookie,
  PERMISSIONS,
} from "@/lib/rbac";

const PROTECTED_ROUTES = ["/admin", "/my-orders"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (!isProtected) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin")) {
    const permissions = parsePermissionsCookie(
      request.cookies.get("userPermissions")?.value
    );
    const required = getRequiredPermission(pathname);

    if (!hasPermission(permissions, required)) {
      if (hasPermission(permissions, PERMISSIONS.DASHBOARD)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/my-orders/:path*"],
};
