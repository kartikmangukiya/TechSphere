import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "Categories", href: "/categories" },
  { name: "About", href: "/about" },
];

export function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <NavLink to={"/"} className="text-xl font-bold tracking-tight">
            Tech<span className="text-primary">Sphere</span>
          </NavLink>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                to={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost">
              <NavLink to="/signin">Login</NavLink>
            </Button>

            <Button variant="default">
              <NavLink to="/signup">Get Started</NavLink>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="mt-8 flex flex-col gap-6 pl-4">
                <NavLink to={"/"} className="text-lg font-semibold">
                  Tech<span className="text-primary">Sphere</span>
                </NavLink>

                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <NavLink to={link.href} className="text-sm font-medium">
                      {link.name}
                    </NavLink>
                  ))}
                </nav>

                <div className="flex flex-col gap-2">
                  <Button variant="ghost">
                    <NavLink to="/signin">Login</NavLink>
                  </Button>

                  <Button variant="default">
                    <NavLink to="/signup">Get Started</NavLink>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
