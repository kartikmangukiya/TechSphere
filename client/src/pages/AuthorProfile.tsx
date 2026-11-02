import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Eye,
  FileText,
  Globe,
  Mail,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

const GithubIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCard } from "@/components/blog/BlogCard";
import { useAuth } from "@/context/AuthContext";
import { getAuthorProfile, type AuthorProfileData } from "@/api/axios";
import { formatDate, formatViews, getErrorMessage } from "@/lib/formatters";

export const AuthorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch author profile and published blogs
  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AuthorProfileData>({
    queryKey: ["author-profile", id],
    queryFn: () => getAuthorProfile(id!),
    enabled: Boolean(id),
  });

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(profileUrl);
        setCopiedLink(true);
        toast.success("Profile link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      toast.error("Could not copy link to clipboard.");
    }
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pb-16">
        <div className="h-44 w-full bg-muted/60 animate-pulse" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-20 space-y-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-72 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-36 mx-auto sm:mx-0" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>

          <div className="space-y-4">
            <Skeleton className="h-7 w-40" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (isError || !profileData) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <FileText className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Author Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          {getErrorMessage(error) || "The author profile you are looking for does not exist."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => void refetch()} className="cursor-pointer">
            Try again
          </Button>
          <Button onClick={() => navigate("/blogs")} className="cursor-pointer">
            Explore articles
          </Button>
        </div>
      </main>
    );
  }

  const { author, stats, blogs } = profileData;
  const isSelf = currentUser?.id === author._id || currentUser?.id === author.id;

  const authorInitials = (author.name || "Author")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Decorative Gradient Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-violet-500/20 border-b">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3.5 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-background shadow-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to articles
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-20 space-y-8">
        {/* Profile Card / Header */}
        <div className="relative rounded-2xl border bg-card/90 backdrop-blur-md p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 border-background shadow-md">
                <AvatarImage
                  src={author.profileImage || undefined}
                  alt={author.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-2xl sm:text-3xl font-bold text-primary">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                  {author.name}
                </h1>
                <Badge variant="secondary" className="text-xs">
                  Author
                </Badge>
                {isSelf && (
                  <Badge variant="outline" className="text-xs border-primary/40 text-primary">
                    You
                  </Badge>
                )}
              </div>

              {author.headline && (
                <p className="text-sm font-medium text-primary">
                  {author.headline}
                </p>
              )}

              {author.bio && (
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed whitespace-pre-wrap">
                  {author.bio}
                </p>
              )}

              {/* Metadata & Social Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  Joined {formatDate(author.createdAt)}
                </span>

                {author.website && (
                  <a
                    href={author.website.startsWith("http") ? author.website : `https://${author.website}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </a>
                )}

                {author.github && (
                  <a
                    href={author.github.startsWith("http") ? author.github : `https://github.com/${author.github.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                )}

                {author.twitter && (
                  <a
                    href={author.twitter.startsWith("http") ? author.twitter : `https://x.com/${author.twitter.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <TwitterIcon className="h-3.5 w-3.5" />
                    Twitter
                  </a>
                )}

                {author.linkedin && (
                  <a
                    href={author.linkedin.startsWith("http") ? author.linkedin : `https://linkedin.com/in/${author.linkedin}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}

                {author.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {author.email}
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Share & Manage */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShareProfile}
                title="Share profile"
                aria-label="Share profile"
                className="cursor-pointer"
              >
                {copiedLink ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </Button>

              {isSelf && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer"
                >
                  Manage Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid: Articles and Views */}
        <section className="grid grid-cols-2 gap-4 max-w-md">
          {/* Published Articles */}
          <Card className="border shadow-xs transition-all hover:border-primary/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Articles
                </p>
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {stats.totalBlogs.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Published works
              </p>
            </CardContent>
          </Card>

          {/* Total Views */}
          <Card className="border shadow-xs transition-all hover:border-primary/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                <div className="rounded-lg bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-violet-600 dark:text-violet-400">
                {formatViews(stats.totalViews)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Across all articles
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Author Articles Feed */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Articles by {author.name}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {blogs.length} {blogs.length === 1 ? "article" : "articles"} published
              </p>
            </div>
          </div>

          {blogs.length === 0 ? (
            <Card className="border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No published articles yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {isSelf
                  ? "You haven't published any articles yet. Create your first article from your dashboard."
                  : `${author.name} hasn't published any articles yet. Check back soon!`}
              </p>
              {isSelf && (
                <Button
                  className="mt-6 cursor-pointer"
                  onClick={() => navigate("/create-blog")}
                >
                  Create First Article
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
export default AuthorProfile;
