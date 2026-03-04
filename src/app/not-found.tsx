import { Home, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8">
          {/* Icon illustration */}
          <div className="relative mb-6">
            <Search className="text-muted-foreground mx-auto h-16 w-16" />
            <X className="text-destructive absolute -top-1 -right-1 h-8 w-8" />
          </div>

          {/* Main heading */}
          <h1 className="text-foreground mb-4 text-4xl font-bold">404</h1>

          {/* Subheading */}
          <h2 className="text-foreground mb-4 text-xl font-semibold">
            Page Not Found
          </h2>

          {/* Friendly explanation */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The wiki page you&apos;re looking for doesn&apos;t exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>

          {/* Call-to-action button */}
          <Link href="/">
            <Button className="w-full" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Wiki Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
