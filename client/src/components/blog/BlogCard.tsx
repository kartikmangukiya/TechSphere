import { Link, NavLink } from "react-router-dom";
import { ArrowRight, CalendarDays, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Blog } from "@/api/axios";
import { formatDate, getAuthorName } from "@/lib/formatters";

// Shared Blog card component
export const BlogCard = ({ blog }: { blog: Blog }) => {
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

// Blog card skeleton loader
export const BlogCardSkeleton = () => {
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
