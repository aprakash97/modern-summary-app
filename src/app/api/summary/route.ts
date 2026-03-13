import { NextRequest, NextResponse } from "next/server";
import { eq, isNull } from "drizzle-orm";
import summarizeArticle from "@/ai/summarize";
import db from "@/db";
import { articles } from "@/db/schema";
import redis from "@/cache";
import { title } from "node:process";

// can only be run within vercel, hint -cron secret
export async function GET(req: NextRequest) {
  if (
    process.env.NODE_ENV !== "development" &&
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
    })
    .from(articles)
    .where(isNull(articles.summary));

  let updated = 0;

  console.log("🤖 starting AI summary job");

  for (const row of rows) {
    try {
      const summary = await summarizeArticle(
        row.title ?? "",
        row.content ?? "",
      );
      if (summary && summary.trim().length > 0) {
        await db
          .update(articles)
          .set({ summary: summary })
          .where(eq(articles.id, row.id));

        updated = updated + 1;
      }
    } catch (e) {
      console.log(`❌Failed to summarize id ${row.id}`);
    }
  }

  if (updated > 0) {
    try {
      await redis.del("articles:all");
    } catch (e) {
      console.log("⚠️ Failed to clear articles cache", e);
    }
  }

  console.log(` 🤖 concluding AI summary job, updated ${updated}rows `);

  return NextResponse.json({ ok: true, updated });
}
