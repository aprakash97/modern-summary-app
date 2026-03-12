"use server";
import redis from "@/cache";
import sendCelebrationEmail from "@/email/celebration-email";

const milestone = [10, 25, 50, 100];

const keyFor = (id: number) => `pageviews:article${id}`;

export async function incrementPageview(articleId: number) {
  const articleKey = keyFor(articleId);
  const newVal = await redis.incr(articleKey);

  if (milestone.includes(newVal)) {
    sendCelebrationEmail(articleId, newVal);
  }

  return +newVal;
}
