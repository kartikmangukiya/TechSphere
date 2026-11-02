import type { BlogAuthor } from "@/types/blog";

/**
 * Formats a date string safely into localized format.
 */
export const formatDate = (date?: string | Date): string => {
  if (!date) {
    return "Recently";
  }

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

/**
 * Extracts author name safely from a string or BlogAuthor object.
 */
export const getAuthorName = (
  author?: string | BlogAuthor | null,
): string => {
  if (!author) {
    return "TechSphere Author";
  }

  if (typeof author === "string") {
    return author;
  }

  return author.name || "TechSphere Author";
};

/**
 * Extracts a readable error message from unknown errors / Axios responses.
 */
export const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

/**
 * Calculates reading time in minutes based on ~200 words per minute.
 */
export const calculateReadingTime = (
  content?: string,
  description?: string,
  fallbackTime?: number,
): number => {
  if (fallbackTime && fallbackTime > 0) {
    return fallbackTime;
  }
  const text = `${description || ""} ${content || ""}`.trim();
  if (!text) return 1;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

/**
 * Formats view count into a compact string (e.g. 1.2k, 3.4M).
 */
export const formatViews = (views?: number): string => {
  if (!views || views <= 0) return "0";
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return views.toLocaleString();
};
