import { db } from 'db';
import { eq, sql } from 'drizzle-orm';
import { text, timestamp, pgTable, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  providerId: text('provider_id'),
  createdAt: timestamp('created_at').notNull(),
  email: text('email'),
  lastLogin: timestamp('last_login')
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const handleLogin = async (providerId: string, email: string) => {
  const existingUser = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.providerId, `${providerId}`));

  // Handle create new user
  if (existingUser.length === 0) {
    await db.insert(users).values({
      providerId: providerId,
      email: email,
      createdAt: new Date()
    });
  } else {
    // Update user profile
    await db
      .update(users)
      .set({
        lastLogin: new Date()
      })
      .where(eq(users.providerId, `${providerId}`));
  }
};
