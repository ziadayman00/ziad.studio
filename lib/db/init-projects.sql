-- Run once in Supabase → SQL Editor if `npm run db:push` is not available.
-- Creates the same table Drizzle expects.

CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "subtitle" text NOT NULL DEFAULT '',
  "category" text NOT NULL,
  "year" text NOT NULL,
  "description" text NOT NULL,
  "long_description" text,
  "color" text NOT NULL,
  "featured" boolean NOT NULL DEFAULT false,
  "responsibility" text,
  "impact" text,
  "tags" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "features" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "images" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "live" text,
  "github" text,
  "coming_soon" boolean NOT NULL DEFAULT false,
  "in_progress" boolean NOT NULL DEFAULT false,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);
