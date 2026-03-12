"use server";

import { stackServerApp } from "@/stack/server";
import { eq } from "drizzle-orm";
import db from "@/db";
import { articles } from "@/db/schema";
import { ensureUserExists } from "@/db/sync-user";
import { authorizeToEditArticle } from "@/db/authz";
import { redirect } from "next/navigation";
import redis from "@/cache";
import summarizeArticle from "../../ai/summarize";

export type CreateArticleInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
};

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

export async function createArticle(data: CreateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  await ensureUserExists(user);

  const summary = await summarizeArticle(data.title || "", data.content || "");
  const res = await db
    .insert(articles)
    .values({
      title: data.title,
      content: data.content,
      authorId: user.id,
      slug: `${Date.now()}`,
      published: true,
      imageUrl: data.imageUrl ?? undefined,
      summary,
    })
    .returning();

  //when user creates an article, will immediately redirected to home page where he can see article.
  redis.del("articles:all");

  console.log("✨ create article called.", data, res);
  return { success: true, message: "Article created", result: res };
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  if (!(await authorizeToEditArticle(user.id, +id))) {
    throw new Error("❌ Forbidden");
  }

  const authorId = user.id;
  const summary = await summarizeArticle(data.title || "", data.content || "");

  try {
    await db
      .update(articles)
      .set({
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl ?? undefined,
        summary: summary ?? undefined,
      })
      .where(eq(articles.id, +id));
  } catch (e) {
    console.error("update error", e);
    //TODO: send to observability platform
  }

  console.log("✅ update article called.", authorId, data);
  return { success: true, message: `Article ${id} updated` };
}

export async function deleteArticle(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  if (!(await authorizeToEditArticle(user.id, +id))) {
    throw new Error("❌ Forbidden");
  }

  await db.delete(articles).where(eq(articles.id, +id));

  console.log("🗑️ delete article called.", id);
  return { success: true, message: "Article deleted" };
}

// Form-friendly server action: accepts FormData from a client form and calls deleteArticle
export async function deleteArticleForm(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Missing article id");
  }

  await deleteArticle(String(id));
  // After deleting, redirect the user back to the homepage.
  redirect("/");
}
