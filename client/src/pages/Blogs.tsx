import { useQuery } from "@tanstack/react-query";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  RefreshCw,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllBlogs, type Blog } from "@/api/axios";
import { formatDate, getAuthorName } from "@/lib/formatters";


// Blog card
const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/blogs/${blog._id}`}
        aria-label={`Read ${blog.title}`}
        className="block overflow-hidden"
      >
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            loading="lazy"
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-52 items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">
              No featured image
            </span>
          </div>
        )}
      </Link>

      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {blog.status === "published" && (
            <Badge variant="secondary">Published</Badge>
          )}

          {blog.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <CardTitle className="line-clamp-2 text-xl leading-snug transition-colors group-hover:text-primary">
          <Link to={`/blogs/${blog._id}`}>
            {blog.title}
          </Link>
        </CardTitle>

        <CardDescription className="line-clamp-3 text-sm leading-6">
          {blog.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserRound className="size-4" />
            {getAuthorName(blog.author)}
          </span>

          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {formatDate(blog.createdAt)}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <NavLink
          to={`/blogs/${blog._id}`}
          className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <span>Read article</span>
          <ArrowRight className="size-4 shrink-0" />
        </NavLink>
      </CardFooter>
    </Card>
  );
};

// Blog card skeleton
const BlogCardSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-xl">
      <Skeleton className="h-52 w-full rounded-none" />

      <CardHeader className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>

        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>

      <CardContent>
        <Skeleton className="h-4 w-2/3" />
      </CardContent>

      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
};

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
                : `${blogs.length} ${
                    blogs.length === 1 ? "article" : "articles"
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
                className={`mr-2 size-4 ${
                  isFetching ? "animate-spin" : ""
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
                  className={`mr-2 size-4 ${
                    isFetching ? "animate-spin" : ""
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

              <Button className="mt-6">
                <Link to="/create-blog">
                  Create your first blog
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
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