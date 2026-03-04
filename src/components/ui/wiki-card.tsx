import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface WikiCardProps {
  title: string;
  author: string;
  date: string;
  summary: string;
  href: string;
}

export function WikiCard({
  title,
  author,
  date,
  summary,
  href,
}: WikiCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        <CardDescription>{summary}</CardDescription>
      </CardContent>
      <CardFooter className="pt-2">
        <Link
          href={href}
          className="w-fit text-sm font-medium text-blue-600 hover:underline"
        >
          Read article &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
