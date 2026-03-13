import resend from "@/email";
import { eq } from "drizzle-orm";
import { usersSync } from "@/db/schema";
import db from "@/db";
import { articles } from "@/db/schema";
import CelebrationTemplate from "@/email/celebration-template";

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default async function sendCelebrationEmail(
  articleId: number,
  pageView: number,
) {
  const response = await db
    .select({
      email: usersSync.email,
      id: usersSync.id,
      title: articles.title,
      name: usersSync.name,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.id, articleId));

  //SELECT usersSync.id, userSync.email FROM articles LEFT JOIN userSync ON articles.authorID = userSync.id WHERE articles.id = $id

  const { email, id, name, title } = response[0];

  if (!email) {
    console.log(
      `❌ skipping celebration email for ${articleId} on pageViews ${pageView}, couldn't find email in database.`,
    );
    return;
  }

  //   const emailRes = await resend.emails.send({
  //     from: "wikimasters <noreply@mail.prakash>",
  //     to: email,
  //     subject: `✨ your article on wikimasters got ${pageView} view`,
  //     html: "<h1>Congrats!</h1><p>You're an amazing author</p>",
  //   });

  const emailRes = await resend.emails.send({
    from: "wikimasters <noreply@resend.dev>",
    to: email,
    subject: `✨ your article on wikimasters got ${pageView} view`,
    html: "<h1>Congrats!</h1><p>You're an amazing author</p>",
    react: (
      <CelebrationTemplate
        name={name ?? "FRIEND"}
        pageviews={pageView}
        articleTitle={title}
        articleUrl={`${BASE_URL}/wiki/${articleId}`}
      />
    ),
  });

  if (!emailRes.error) {
    console.log(
      `🙌 sent ${id} a celebration email for getting ${pageView} on article ${articleId}`,
    );
  } else {
    console.log(
      `❌ error sending ${id} a celebration email for getting ${pageView} on article ${articleId}`,
    );
  }
}
