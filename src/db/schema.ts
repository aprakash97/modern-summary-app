import { serial, text, timestamp, boolean, pgTable } from "drizzle-orm/pg-core";

export const usersSync = pgTable("users_sync", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  token: text("token")
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false).notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => usersSync.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

const schema = { articles, usersSync };

export default schema;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type User = typeof usersSync.$inferSelect;
