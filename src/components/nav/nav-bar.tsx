import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";

export async function NavBar() {
  const user = await stackServerApp.getUser();
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex w-full items-center justify-between gap-2">
          <Link
            href="/"
            className="mx-8 text-xl font-bold tracking-tight text-gray-900"
          >
            WikiMasters
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-2">
              {user ? (
                <NavigationMenuItem>
                  <UserButton />
                </NavigationMenuItem>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Button asChild variant="outline">
                      <Link href="/handler/sign-in">Sign In</Link>
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button asChild>
                      <Link href="/handler/sign-up">Sign Up</Link>
                    </Button>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
