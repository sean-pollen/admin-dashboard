import { text, timestamp, serial, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id'),
  name: text('name'),
  email: text('email'),
  createdAt: timestamp('created_at')
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
