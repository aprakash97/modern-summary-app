import { WikiCard } from "@/components/ui/wiki-card";

import { getArticles } from "@/lib/data/articles";

export default async function Home() {
  const articles = await getArticles();
  return (
    <div>
      <main className="mx-auto mt-10 flex max-w-2xl flex-col gap-6">
        {articles.map(({ title, id, createdAt, summary, author }) => (
          <WikiCard
            title={title}
            author={author ? author : "Unknown"}
            date={createdAt}
            summary={summary ?? ""} // temporary
            href={`/wiki/${id}`}
            key={id}
          />
        ))}
      </main>
    </div>
  );
}
