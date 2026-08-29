import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'civicflow_session';

const ROLE_PREFIXES: Record<string, string> = {
  '/citizen': 'CITIZEN',
  '/authority': 'AUTHORITY',
  '/dept-admin': 'DEPT_ADMIN',
  '/super-admin': 'SUPER_ADMIN',
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const prefix = Object.keys(ROLE_PREFIXES).find((p) => pathname.startsWith(p));
  if (!prefix) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.redirect(new URL('/signin', req.url));

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const requiredRole = ROLE_PREFIXES[prefix];
    if (payload.role !== requiredRole) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

export const config = {
  matcher: ['/citizen/:path*', '/authority/:path*', '/dept-admin/:path*', '/super-admin/:path*'],
};
