import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  className?: string;
  align?: "start" | "end" | "center";
}

export function ThemeToggle({ className, align = "end" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={className || "h-9 w-9 rounded-full cursor-pointer"}
            aria-label="Select theme"
          />
        }
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-4 w-4 transition-transform duration-200" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-200" />
        )}
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-36">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex cursor-pointer items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            Light
          </span>
          {theme === "light" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex cursor-pointer items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-sky-400" />
            Dark
          </span>
          {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex cursor-pointer items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            System
          </span>
          {theme === "system" && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
