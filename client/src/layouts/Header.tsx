import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "Categories", href: "/categories" },
  { name: "About", href: "/about" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="shrink-0 text-2xl font-bold tracking-tight">
          Tech<span className="text-primary">Sphere</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost">
            <NavLink to="/signin">Login</NavLink>
          </Button>

          <Button>
            <NavLink to="/signup">Get Started</NavLink>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="flex flex-col gap-8 pt-8">
                {/* Mobile Logo */}
                <NavLink
                  to="/"
                  className="text-xl font-bold tracking-tight ml-4"
                >
                  Tech<span className="text-primary">Sphere</span>
                </NavLink>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-5 ml-5">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      className={({ isActive }) =>
                        `text-base font-medium transition-colors ${
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-3">
                  <Button variant="outline">
                    <NavLink to="/signin">Login</NavLink>
                  </Button>

                  <Button>
                    <NavLink to="/signup">Get Started</NavLink>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
