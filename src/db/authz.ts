import { eq } from "drizzle-orm";
import { articles } from "@/db/schema";
import db from "@/db";

export const authorizeToEditArticle = async function authorizeUserToEdit(
  loggedInUserId: string,
  articleId: number,
) {
  const response = await db.select({
    authorId: articles.authorId
  })
  .from(articles)
  .where(eq(articles.id, articleId))

  if(!response.length){
    return false
  }

  return response[0].authorId === loggedInUserId
};
