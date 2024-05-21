// import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTableCreator,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { DATABASE_PREFIX as prefix } from '~/lib/constants';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    spotifyId: varchar('spotify_id').unique(),
    spotifyUrl: varchar('spotify_url'),
    name: varchar('name'),
    description: varchar('description'),
    email: varchar('email').unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
      () => new Date()
    ),
    slug: varchar('slug').unique(),
  },
  (t) => ({
    emailIndex: index('user_email_idx').on(t.email),
    spotifyIndex: index('user_spotify_idx').on(t.spotifyId),
  })
);

export const userPrivacySettings = pgTable('user_settings', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .notNull()
    .references(() => users.id),
  publicProfile: boolean('public_profile').notNull(),
});

// export const userRelations = relations(users, ({ one }) => ({
//   profilePicture: one(profilePicture),
//   oauthAccount: one(oauthAccount),
// }))

export const profilePicture = pgTable('profile_picture', {
  id: varchar('id').primaryKey(), // uploadthing unique key
  url: varchar('url').notNull(),
  userId: varchar('user_id', { length: 21 })
    .notNull()
    .references(() => users.id),
});

export const betaUsers = pgTable('beta_users', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const oauthAccount = pgTable('oauth_account', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .notNull()
    .references(() => users.id),
  provider: varchar('provider').notNull(),
  providerUserId: varchar('provider_user_id').notNull(),
  accessToken: varchar('access_token').notNull(),
  refreshToken: varchar('refresh_token'),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }),
});

export const sessions = pgTable(
  'sessions',
  {
    id: varchar('id').primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (t) => ({
    userIndex: index('session_user_idx').on(t.userId),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
