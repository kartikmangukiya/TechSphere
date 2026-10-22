import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { getAllBlogs, type Blog } from "@/api/axios";
import { BlogCard, BlogCardSkeleton } from "@/components/blog/BlogCard";

// Blogs page
export const Blogs = () => {
  const {
    data: blogs = [],
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Blog[], Error>({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Page heading */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Latest articles
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isPending
                ? "Loading articles..."
                : `${blogs.length} ${blogs.length === 1 ? "article" : "articles"
                } found`}
            </p>
          </div>

          {isError && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""
                  }`}
              />
              Retry
            </Button>
          )}
        </div>

        {/* Loading state */}
        {isPending && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isPending && (
          <Card className="border-destructive/30">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <h3 className="text-xl font-semibold">
                Unable to load blogs
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {error.message ||
                  "Something went wrong while fetching articles."}
              </p>

              <Button
                className="mt-5"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""
                    }`}
                />
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!isPending && !isError && blogs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <CalendarDays className="size-8 text-muted-foreground" />
              </div>

              <h3 className="text-xl font-semibold">
                No blogs published yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Be the first to share your knowledge with the
                TechSphere community.
              </p>

              <Link
                to="/create-blog"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
              >
                Create your first blog
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Blog cards */}
        {!isPending && !isError && blogs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};