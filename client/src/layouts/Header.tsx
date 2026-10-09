import { useState } from "react";
import { Menu, LogOut, UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/api/axios";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "About", href: "/about" },
];

export function Header() {
  const { user, isLoading, setUser } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logoutUser();
      setUser(null);
      navigate("/");
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  const authActions = (
    <>
      {!isLoading &&
        (user ? (
          <>
            {" "}
            <span className="flex items-center gap-2 text-sm font-medium">
              {" "}
              <UserRound className="h-4 w-4" />
              Welcome, {user.name}{" "}
            </span>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </>
        ) : (
          <>
            <NavLink
              to="/signin"
              className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
            </NavLink>
          </>
        ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      {" "}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}{" "}
        <NavLink to="/" className="shrink-0 text-2xl font-bold tracking-tight">
          Tech<span className="text-primary">Sphere</span>{" "}
        </NavLink>
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
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
        <div className="hidden items-center gap-3 md:flex">{authActions}</div>
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />

            <SheetContent side="right">
              <div className="flex flex-col gap-8 pt-8">
                {/* Mobile Logo */}
                <NavLink
                  to="/"
                  className="ml-4 text-xl font-bold tracking-tight"
                >
                  Tech<span className="text-primary">Sphere</span>
                </NavLink>

                {/* Mobile Navigation */}
                <nav className="ml-5 flex flex-col gap-5">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      end={link.href === "/"}
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

                {/* Mobile Authentication Actions */}
                <div className="flex flex-col items-stretch gap-3 px-4">
                  {authActions}
                </div>

                {logoutError && (
                  <p className="px-4 text-sm text-destructive" role="alert">
                    {logoutError}
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Desktop logout error */}
      {logoutError && (
        <p
          className="mx-auto max-w-7xl px-4 pb-2 text-sm text-destructive"
          role="alert"
        >
          {logoutError}
        </p>
      )}
    </header>
  );
}
