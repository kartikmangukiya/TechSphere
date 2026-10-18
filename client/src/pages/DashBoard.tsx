import {
  FileText,
  Eye,
  PenLine,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileEdit,
  BookOpen,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const stats = [
  {
    title: "Total Articles",
    value: "12",
    description: "All your articles",
    icon: FileText,
  },
  {
    title: "Published",
    value: "8",
    description: "Available to readers",
    icon: CheckCircle2,
  },
  {
    title: "Drafts",
    value: "4",
    description: "Work in progress",
    icon: FileEdit,
  },
  {
    title: "Total Views",
    value: "2,450",
    description: "Across all articles",
    icon: Eye,
  },
];

const recentArticles = [
  {
    id: "1",
    title: "Building Modern React Applications with TypeScript",
    category: "React",
    status: "published",
    updatedAt: "Oct 16, 2026",
    views: 840,
  },
  {
    id: "2",
    title: "Understanding Angular Signals",
    category: "Angular",
    status: "published",
    updatedAt: "Oct 14, 2026",
    views: 625,
  },
  {
    id: "3",
    title: "Building REST APIs with Node.js",
    category: "Node.js",
    status: "draft",
    updatedAt: "Oct 12, 2026",
    views: 0,
  },
  {
    id: "4",
    title: "Getting Started with TypeScript",
    category: "TypeScript",
    status: "published",
    updatedAt: "Oct 10, 2026",
    views: 985,
  },
];

export const Dashboard = () => {
  const { user } = useAuth();

  const userInitials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">
              USER DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Developer"}!
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage your articles, track performance, and share your
              knowledge with the TechSphere community.
            </p>
          </div>

          <Button asChild className="shrink-0">
            <NavLink to="/create-blog">
              <Plus className="mr-2 h-4 w-4" />
              Create Article
            </NavLink>
          </Button>
        </section>

        {/* Profile Summary */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {userInitials}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">
                {user?.name || "Developer"}
              </h2>

              <p className="break-all text-sm text-muted-foreground">
                {user?.email || "Welcome to TechSphere"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Member
                </Badge>

                <span className="text-xs text-muted-foreground">
                  TechSphere Community
                </span>
              </div>
            </div>

            <Button variant="outline" asChild>
              <NavLink to="/blogs">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Blogs
              </NavLink>
            </Button>
          </CardContent>
        </Card>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's how your content is performing.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card key={stat.title}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>

                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>

                    <p className="mt-4 text-3xl font-bold">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Articles */}
          <section className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  My Articles
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your recently updated content.
                </p>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <NavLink to="/my-blogs">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
            </div>

            <Card>
              <CardContent className="divide-y p-0">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-start gap-3 p-4 sm:items-center sm:p-5"
                  >
                    <div className="mt-1 rounded-lg bg-muted p-2 sm:mt-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-medium">
                        {article.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">
                          {article.category}
                        </Badge>

                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.updatedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Badge
                        variant={
                          article.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {article.status === "published"
                          ? "Published"
                          : "Draft"}
                      </Badge>

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {article.views}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Actions for ${article.title}`}
                            />
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              // Connect to your article editing route.
                            }}
                          >
                            <PenLine className="mr-2 h-4 w-4" />
                            Edit article
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              // Connect to your article details route.
                            }}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            View article
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <aside className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                What would you like to do today?
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Create something new
                </CardTitle>

                <CardDescription>
                  Share your knowledge with other developers.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <NavLink to="/create-blog">
                    <Plus className="mr-2 h-4 w-4" />
                    Write an article
                  </NavLink>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <NavLink to="/blogs">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse articles
                  </NavLink>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <NavLink to="/about">
                    <UserRound className="mr-2 h-4 w-4" />
                    About TechSphere
                  </NavLink>
                </Button>
              </CardContent>
            </Card>

            {/* Writing Tip */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>

                  <CardTitle className="text-base">
                    Writing Tip
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  Great articles solve real problems. Use clear headings,
                  practical examples, and code snippets to help readers
                  learn faster.
                </p>

                <Button
                  variant="link"
                  className="mt-2 h-auto p-0"
                  asChild
                >
                  <NavLink to="/create-blog">
                    Start writing
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </NavLink>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
};