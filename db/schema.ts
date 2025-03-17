import { relations, sql } from 'drizzle-orm';
import { text, timestamp, pgTable, uuid, json } from 'drizzle-orm/pg-core';

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

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles)
}));

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
};

export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references((): any => users.id),
  location: text('location'),
  bio: text('bio'),
  topAlbums: json('top_albums'),
  ...timestamps
});

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] })
}));

export type Profile = typeof profiles.$inferSelect;
export type ProfileInsert = typeof profiles.$inferInsert;
