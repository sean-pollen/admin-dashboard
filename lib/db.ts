import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const User = pgTable('users', {
  id: serial('id'),
  name: text('name'),
  email: text('email'),
  createdAt: timestamp('created_at')
});

export type User = typeof User;
