import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  RefreshCw,
  Search,
  SearchX,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllBlogs, type GetAllBlogsResult } from "@/api/axios";
import { BlogCard, BlogCardSkeleton } from "@/components/blog/BlogCard";

export const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") || "";
  const tagParam = searchParams.get("tag") || "all";

  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync internal search input when URL search param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Debounce search query into URL
  useEffect(() => {
    const handler = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      const currentVal = next.get("search") || "";
      const trimmed = searchInput.trim();

      if (trimmed) {
        if (currentVal !== trimmed) {
          next.set("search", trimmed);
          setSearchParams(next, { replace: true });
        }
      } else if (next.has("search")) {
        next.delete("search");
        setSearchParams(next, { replace: true });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput, searchParams, setSearchParams]);

  // Query blogs matching current search and tag
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<GetAllBlogsResult, Error>({
    queryKey: ["blogs", { search: searchParam, tag: tagParam }],
    queryFn: () =>
      getAllBlogs({
        search: searchParam || undefined,
        tag: tagParam !== "all" ? tagParam : undefined,
      }),
  });

  const blogs = data?.blogs ?? [];
  const availableTags = data?.tags ?? [];

  const isFiltered = Boolean(searchParam || (tagParam && tagParam !== "all"));

  const handleTagClick = (tag: string) => {
    const next = new URLSearchParams(searchParams);
    if (tag === "all" || tag === tagParam) {
      next.delete("tag");
    } else {
      next.set("tag", tag);
    }
    setSearchParams(next, { replace: true });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    setSearchParams(next, { replace: true });
  };

  const handleResetAll = () => {
    setSearchInput("");
    setSearchParams({}, { replace: true });
  };

  const formatTagLabel = (tag: string) => {
    return tag
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero / Header Section */}
      <section className="border-b bg-muted/30 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Curated Articles
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Explore Tech<span className="text-primary">Sphere</span>
            </h1>

            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Discover in-depth tutorials, developer guides, and discussions on
              modern full-stack web development.
            </p>

            {/* Search Bar */}
            <div className="mt-8 w-full max-w-2xl">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles by title, description, or keyword..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-11 rounded-full border-border/80 bg-background pl-10 pr-10 text-sm shadow-xs transition-shadow focus-visible:ring-primary/30"
                  aria-label="Search articles"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3.5 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category / Tag Filter Pills */}
            <div className="mt-6 flex w-full max-w-4xl flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleTagClick("all")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  tagParam === "all"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border/60 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                All Topics
              </button>

              {availableTags.map((tag) => {
                const isActive = tagParam.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "border border-border/60 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <Tag className="h-3 w-3 opacity-60" />
                    {formatTagLabel(tag)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Results Bar / Active Filter Feedback */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span>
              {isPending
                ? "Loading articles..."
                : `${blogs.length} ${
                    blogs.length === 1 ? "article" : "articles"
                  } found`}
            </span>

            {isFiltered && (
              <>
                <span>•</span>
                <span className="font-medium text-foreground">
                  {searchParam && `Search: "${searchParam}"`}
                  {searchParam && tagParam !== "all" && " | "}
                  {tagParam !== "all" && `Topic: ${formatTagLabel(tagParam)}`}
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleResetAll}
                  className="h-6 rounded-full px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear filters
                </Button>
              </>
            )}
          </div>

          {isError && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Retry
            </Button>
          )}
        </div>

        {/* Loading Skeletons */}
        {isPending && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isPending && (
          <Card className="border-destructive/30">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <h3 className="text-xl font-semibold">Unable to load blogs</h3>
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
                  className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filtered Empty State (No matches for current search/tag) */}
        {!isPending && !isError && blogs.length === 0 && isFiltered && (
          <Card className="border-dashed py-12">
            <CardContent className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <SearchX className="size-8 text-muted-foreground" />
              </div>

              <h3 className="text-xl font-semibold">No matching articles</h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                We couldn&apos;t find any articles matching your search query or
                selected topic. Try broadening your keywords.
              </p>

              <div className="mt-6 flex gap-3">
                <Button onClick={handleResetAll} variant="default" size="sm">
                  Clear all filters
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/create-blog">Write an article</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Initial Empty State (No blogs published at all) */}
        {!isPending && !isError && blogs.length === 0 && !isFiltered && (
          <Card>
            <CardContent className="flex flex-col items-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <CalendarDays className="size-8 text-muted-foreground" />
              </div>

              <h3 className="text-xl font-semibold">No blogs published yet</h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Be the first to share your knowledge with the TechSphere
                community.
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

        {/* Blog Cards Grid */}
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