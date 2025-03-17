import { auth } from '@/lib/auth';
import { db } from 'db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  console.log(session)

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { name, email } = session.user;

  if (!email || !name) {
    return new Response('Unauthorized', { status: 401 });
  }

  const response = await db.query.users.findFirst({
    with: {
      profile: true
    },
    where: (users, { eq }) => eq(users.email, email)
  });

  if (!response) {
    return new Response('Unable to load profile', { status: 404 });
  }

  return NextResponse.json(response);
}
