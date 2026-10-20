import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Heart,
  LogIn,
  MessageCircle,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import {
  getBlogById,
  getBlogLikes,
  likeBlog,
  unlikeBlog,
  getBlogComments,
  createBlogComment,
  deleteBlogComment,
} from "@/api/axios";
import type {
  Blog,
  BlogComment,
  BlogCommentsResponse,
  BlogLikeSummary,
} from "@/types/blog";
import {
  formatDate,
  getAuthorName,
  getErrorMessage,
} from "@/lib/formatters";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export const SingalBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const [commentText, setCommentText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch blog details
  const {
    data: blog,
    isLoading: isBlogLoading,
    isError: isBlogError,
    error: blogError,
  } = useQuery<Blog>({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id!),
    enabled: Boolean(id),
  });

  // Fetch likes summary
  const {
    data: likes,
    isLoading: isLikesLoading,
  } = useQuery<BlogLikeSummary>({
    queryKey: ["blog-likes", id],
    queryFn: () => getBlogLikes(id!),
    enabled: Boolean(id),
  });

  // Fetch comments
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery<BlogCommentsResponse>({
    queryKey: ["blog-comments", id],
    queryFn: () => getBlogComments(id!, 1, 50),
    enabled: Boolean(id),
  });

  const comments = commentsData?.comments ?? [];

  // Like / Unlike blog mutation with optimistic updates
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Blog ID is missing.");
      }

      return likes?.isLiked ? unlikeBlog(id) : likeBlog(id);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["blog-likes", id] });

      const previousLikes = queryClient.getQueryData<BlogLikeSummary>([
        "blog-likes",
        id,
      ]);

      queryClient.setQueryData<BlogLikeSummary>(["blog-likes", id], (old) => {
        if (!old) {
          return { isLiked: true, likeCount: 1 };
        }
        const nextIsLiked = !old.isLiked;
        return {
          isLiked: nextIsLiked,
          likeCount: Math.max(0, old.likeCount + (nextIsLiked ? 1 : -1)),
        };
      });

      return { previousLikes };
    },

    onError: (error: unknown, _vars, context) => {
      if (context?.previousLikes) {
        queryClient.setQueryData(["blog-likes", id], context.previousLikes);
      }
      const message = getErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    },

    onSuccess: (data) => {
      queryClient.setQueryData<BlogLikeSummary>(["blog-likes", id], data);
      setErrorMessage("");
      toast.success(data.isLiked ? "Blog liked!" : "Blog unliked!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-likes", id],
      });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      if (!id) {
        throw new Error("Blog ID is missing.");
      }

      return createBlogComment(id, content);
    },

    onSuccess: () => {
      setCommentText("");
      setErrorMessage("");
      toast.success("Comment posted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["blog-comments", id],
      });
    },

    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => {
      if (!id) {
        throw new Error("Blog ID is missing.");
      }

      return deleteBlogComment(id, commentId);
    },

    onSuccess: () => {
      setErrorMessage("");
      toast.success("Comment deleted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["blog-comments", id],
      });
    },

    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    },
  });

  // Handle like button click
  const handleLike = () => {
    if (!id || isLikesLoading || likeMutation.isPending) {
      return;
    }

    if (!isAuthenticated) {
      toast.warning("Please sign in to like this blog post.");
      navigate("/signin");
      return;
    }

    setErrorMessage("");
    likeMutation.mutate();
  };

  // Handle comment submission
  const handleAddComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.warning("Please sign in to leave a comment.");
      navigate("/signin");
      return;
    }

    const content = commentText.trim();

    if (!content) {
      setErrorMessage("Please enter a comment.");
      toast.error("Please enter a comment.");
      return;
    }

    if (content.length > 2000) {
      setErrorMessage("Comment cannot exceed 2000 characters.");
      toast.error("Comment cannot exceed 2000 characters.");
      return;
    }

    setErrorMessage("");
    addCommentMutation.mutate(content);
  };

  // Handle comment deletion
  const handleDeleteComment = (commentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    deleteCommentMutation.mutate(commentId);
  };

  // Loading state
  if (isBlogLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="h-72 rounded-xl bg-muted" />
          <div className="h-4 rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
      </main>
    );
  }

  // Blog error state
  if (isBlogError || !blog) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Unable to load blog</h1>

        <p className="mt-3 text-muted-foreground">
          {getErrorMessage(blogError)}
        </p>

        <Link
          to="/blogs"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
        >
          <ArrowLeft size={18} />
          Back to blogs
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <Link
        to="/blogs"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft size={18} />
        Back to blogs
      </Link>

      {/* Blog article */}
      <article>
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {blog.title}
        </h1>

        {/* Description */}
        {blog.description && (
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {blog.description}
          </p>
        )}

        {/* Author and date */}
        <div className="mt-6 flex flex-wrap items-center gap-5 border-b pb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserRound size={18} />
            <span>{getAuthorName(blog.author)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={18} />

            <time dateTime={blog.createdAt || undefined}>
              {formatDate(blog.createdAt)}
            </time>
          </div>
        </div>

        {/* Featured image */}
        {blog.featuredImage && (
          <div className="mt-8 overflow-hidden rounded-2xl">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="max-h-125 w-full object-cover"
            />
          </div>
        )}

        {/* Blog content */}
        <div className="mt-8 whitespace-pre-wrap break-words text-base leading-8 text-foreground">
          {blog.content}
        </div>

        {/* Like and comment counts bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y py-5">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleLike}
              disabled={isLikesLoading || likeMutation.isPending}
              aria-pressed={likes?.isLiked ?? false}
              title={
                isAuthenticated
                  ? likes?.isLiked
                    ? "Unlike this blog"
                    : "Like this blog"
                  : "Sign in to like this blog"
              }
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer ${
                likes?.isLiked
                  ? "bg-red-500/10 text-red-600 font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-red-500"
              }`}
            >
              <Heart
                size={21}
                className={likes?.isLiked ? "fill-current" : ""}
              />

              <span>
                {likeMutation.isPending
                  ? "Updating..."
                  : likes?.likeCount ?? 0}
              </span>
            </button>

            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <MessageCircle size={21} />

              <span>
                {commentsData?.pagination?.total ?? comments.length} comments
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Error message */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
        >
          {errorMessage}
        </div>
      )}

      {/* Comments section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Comments</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Share your thoughts and discuss with the community.
        </p>

        {/* Add comment form or Sign-in prompt */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mt-6 space-y-3">
            <label htmlFor="comment" className="text-sm font-medium">
              Write a comment
            </label>

            <textarea
              id="comment"
              name="comment"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write your comment here..."
              maxLength={2000}
              rows={4}
              className="w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {commentText.length}/2000
              </span>

              <button
                type="submit"
                disabled={
                  !commentText.trim() || addCommentMutation.isPending
                }
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <Send size={16} />

                {addCommentMutation.isPending
                  ? "Posting..."
                  : "Post comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed p-6 text-center bg-muted/20">
            <MessageCircle className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-2 text-base font-semibold">Join the discussion</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to share your thoughts, comment, and engage with the author.
            </p>
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              <LogIn className="mr-2 size-4" />
              Sign in to comment
            </Button>
          </div>
        )}

        {/* Comments loading */}
        {isCommentsLoading && (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse space-y-3 rounded-xl border p-4"
              >
                <div className="h-4 w-1/4 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Comments error */}
        {isCommentsError && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600"
          >
            Unable to load comments: {getErrorMessage(commentsError)}
          </div>
        )}

        {/* Comments list */}
        {!isCommentsLoading &&
          !isCommentsError &&
          (comments.length > 0 ? (
            <div className="mt-8 space-y-5">
              {comments.map((comment) => {
                const commentAuthorId =
                  typeof comment.author === "object" && comment.author !== null
                    ? comment.author._id || comment.author.id
                    : comment.author;

                const isOwner = Boolean(
                  user && user.id && commentAuthorId === user.id,
                );

                return (
                  <div
                    key={comment._id}
                    className="rounded-xl border p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 font-medium">
                            <UserRound
                              size={17}
                              className="text-muted-foreground"
                            />

                            <span>{getAuthorName(comment.author)}</span>
                          </div>

                          <time
                            dateTime={comment.createdAt}
                            className="text-xs text-muted-foreground"
                          >
                            {formatDate(comment.createdAt)}
                          </time>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">
                          {comment.content}
                        </p>
                      </div>

                      {/* Delete button only displayed for comment owner */}
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={deleteCommentMutation.isPending}
                          aria-label="Delete comment"
                          title="Delete comment"
                          className="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed p-10 text-center">
              <MessageCircle
                size={32}
                className="mx-auto text-muted-foreground"
              />

              <h3 className="mt-3 font-semibold">No comments yet</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to share your thoughts!
              </p>
            </div>
          ))}
      </section>
    </main>
  );
};