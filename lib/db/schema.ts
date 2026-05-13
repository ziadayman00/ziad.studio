import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull().default(''),
  category: text('category').notNull(),
  year: text('year').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  color: text('color').notNull(),
  featured: boolean('featured').notNull().default(false),
  responsibility: text('responsibility'),
  impact: text('impact'),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  live: text('live'),
  github: text('github'),
  comingSoon: boolean('coming_soon').notNull().default(false),
  inProgress: boolean('in_progress').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type ProjectRow = typeof projects.$inferSelect
export type ProjectInsert = typeof projects.$inferInsert
