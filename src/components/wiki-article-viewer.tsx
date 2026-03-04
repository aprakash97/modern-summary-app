"use client";

import { Calendar, ChevronRight, Edit, Home, Trash, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { deleteArticleForm } from "@/app/actions/articles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ViewerArticle {
  title: string;
  author: string | null;
  id: number;
  content: string;
  createdAt: string;
  imageUrl?: string | null;
}

interface WikiArticleViewerProps {
  article: ViewerArticle;
  canEdit?: boolean;
  pageviews?: number | null;
}

export default function WikiArticleViewer({
  article,
  canEdit = false,
}: WikiArticleViewerProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-muted-foreground mb-6 flex items-center space-x-2 text-sm">
        <Link
          href="/"
          className="hover:text-foreground flex items-center transition-colors"
        >
          <Home className="mr-1 h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{article.title}</span>
      </nav>

      {/* Article Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            {article.title}
          </h1>

          {/* Article Metadata */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              <span>By {article.author ?? "Unknown"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Badge variant="secondary">Article</Badge>
            </div>
          </div>
        </div>

        {/* Edit Button - Only shown if user has edit permissions */}
        {canEdit && (
          <div className="ml-4 flex items-center gap-2">
            <Link href={`/wiki/edit/${article.id}`} className="cursor-pointer">
              <Button variant="outline" className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit Article
              </Button>
            </Link>

            {/* Delete form calls the server action wrapper */}
            <form action={deleteArticleForm}>
              <input type="hidden" name="id" value={String(article.id)} />
              <Button
                type="submit"
                variant="destructive"
                className="ml-2 cursor-pointer"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Article Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Article Image - Display if exists */}
          {article.imageUrl && (
            <div className="mb-8">
              <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-80">
                <Image
                  src={article.imageUrl}
                  alt={`Image for ${article.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Rendered Markdown Content */}
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Customize heading styles
                h1: ({ children }) => (
                  <h1 className="text-foreground mt-8 mb-4 text-3xl font-bold">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-foreground mt-6 mb-3 text-2xl font-semibold">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-foreground mt-4 mb-2 text-xl font-semibold">
                    {children}
                  </h3>
                ),
                // Customize paragraph styles
                p: ({ children }) => (
                  <p className="text-foreground mb-4 leading-7">{children}</p>
                ),
                // Customize list styles
                ul: ({ children }) => (
                  <ul className="text-foreground mb-4 ml-6 list-disc">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-foreground mb-4 ml-6 list-decimal">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground mb-1">{children}</li>
                ),
                // Customize code styles
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted mb-4 overflow-x-auto rounded-lg p-4 text-sm">
                    {children}
                  </pre>
                ),
                // Customize blockquote styles
                blockquote: ({ children }) => (
                  <blockquote className="border-muted-foreground text-muted-foreground my-4 border-l-4 pl-4 italic">
                    {children}
                  </blockquote>
                ),
                // Customize link styles
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary font-medium hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // Customize table styles
                table: ({ children }) => (
                  <div className="mb-4 overflow-x-auto">
                    <table className="border-border min-w-full border-collapse border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border-border bg-muted border px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-border border px-4 py-2">{children}</td>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="mt-8 flex items-center justify-between">
        <Link href="/">
          <Button variant="outline">← Back to Articles</Button>
        </Link>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Link href={`/wiki/edit/${article.id}`} className="cursor-pointer">
              <Button className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit This Article
              </Button>
            </Link>

            <form action={deleteArticleForm}>
              <input type="hidden" name="id" value={String(article.id)} />
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
