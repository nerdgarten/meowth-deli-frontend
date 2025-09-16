import { type NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  id: number;
  email: string;
  role: string;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const response = NextResponse.next();

  if(!token) {
    response.cookies.delete("user");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);
    response.cookies.set("authenticated", "true", { httpOnly: false });
  } catch {
    response.cookies.delete("authenticated");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|assets|public).*)",
  ],
};