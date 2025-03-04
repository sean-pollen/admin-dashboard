import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { isBefore } from 'date-fns';

export async function middleware(request: NextRequest) {
  if (request.url.includes('/login')) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname == '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  const session = await auth();

  if (
    !session ||
    !session.user ||
    isBefore(new Date(session.expires), new Date())
  ) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
