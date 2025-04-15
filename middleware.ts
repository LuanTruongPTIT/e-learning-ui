import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;
  console.log(path);
  // Public routes - accessible without authentication
  if (path === "/sign-in") {
    if (token) {
      // Redirect authenticated users based on their role
      if (role === "Administrator") {
        return NextResponse.redirect(new URL("/teacher", request.url));
      } else if (role === "Lecturer") {
        return NextResponse.redirect(new URL("/teacher", request.url));
      } else if (role === "Student") {
        return NextResponse.redirect(new URL("/student", request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // // Role-based route protection
  // if (path.startsWith("/admin") && role !== "Administrator") {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  // if (path.startsWith("/teacher") && role !== "Lecturer") {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  // if (path.startsWith("/student") && role !== "Student") {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/sign-in"],
};
