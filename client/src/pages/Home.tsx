import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogs, type Blog } from "@/api/axios";
import { BlogCard, BlogCardSkeleton } from "@/components/blog/BlogCard";

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: blogs = [], isPending } = useQuery<Blog[], Error>({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });

  const latestBlogs = blogs.slice(0, 3);

  const handleStartWriting = () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      toast.warning("Please log in to create a blog.");
      navigate("/signin");
      return;
    }

    navigate("/create-blog");
  };

  return (
    <main>
      {/* Hero */}
      <section className="border-b">
        <div className="container mx-auto px-2 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Explore the world of
              Technology
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Learn. Build. <span className="text-primary">Innovate.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              TechSphere is a developer-focused blog where you can discover
              practical insights about React, Angular, Node.js, TypeScript, AI,
              and modern web development.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg">
                <NavLink
                  to="/blogs"
                  className="inline-flex items-center whitespace-nowrap"
                >
                  Explore Articles
                  <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                </NavLink>
              </Button>

              <Button
                className="cursor-pointer"
                size="lg"
                variant="outline"
                onClick={handleStartWriting}
              >
                Start Writing
              </Button>
            </div>
            {/* Stats */}
            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x">
              <div>
                <p className="text-2xl font-bold">100+</p>
                <p className="text-sm text-muted-foreground"> Articles </p>
              </div>
              <div>
                <p className="text-2xl font-bold">20+</p>
                <p className="text-sm text-muted-foreground"> Topics </p>
              </div>
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground"> Readers </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Blogs Section */}
      <section className="py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                FEATURED ARTICLES
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Latest From Tech<span className="text-primary">Sphere</span>
              </h2>
              <p className="mt-2 text-muted-foreground">
                Discover developer-focused insights, tutorials, and deep dives.
              </p>
            </div>

            <Link
              to="/blogs"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline transition-colors"
            >
              View all articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Blogs Grid */}
          {isPending ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : latestBlogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <Card className="rounded-xl border border-dashed p-8 text-center">
              <CardContent className="space-y-3">
                <p className="text-base font-medium text-foreground">
                  No articles found yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Be the first one to share your story on TechSphere!
                </p>
                <Button
                  onClick={handleStartWriting}
                  className="mt-2 cursor-pointer"
                >
                  Create First Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-4xl">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold"> Stay in the loop </h2>
                <p className="mt-2 text-muted-foreground">
                  Get the latest developer articles and technology insights
                  directly in your inbox.
                </p>
              </div>
              <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                <Input type="email" placeholder="Enter your email" />
                <Button> Subscribe </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};
