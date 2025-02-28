import { auth } from '@/lib/auth';
import { db } from 'db';
import { users } from 'db/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { name, email } = session.user;

  if (!email || !name) {
    return new Response('Unauthorized', { status: 401 });
  }

  const response = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.name, name)));

  return NextResponse.json(response);
}
