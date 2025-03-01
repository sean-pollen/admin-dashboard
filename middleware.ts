import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { isBefore } from 'date-fns';

export async function middleware(request: Request) {
  if (request.url.includes('/login')) {
    return NextResponse.next();
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
