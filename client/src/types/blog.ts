export type BlogStatus = "draft" | "published";

export interface BlogAuthor {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  profileImage?: string;
}

export interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  author?: string | BlogAuthor;
  tags?: string[];
  featuredImage?: string | null;
  status?: BlogStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogListData {
  blogs: Blog[];
  tags?: string[];
  pagination?: BlogPagination;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface BlogFilterParams {
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export interface GetAllBlogsResult {
  blogs: Blog[];
  tags: string[];
  total?: number;
  pagination?: BlogPagination;
}

export interface BlogLikeSummary {
  isLiked: boolean;
  likeCount: number;
}

export interface BlogComment {
  _id: string;
  blog?: string;
  author: string | BlogAuthor;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogCommentsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogCommentsResponse {
  comments: BlogComment[];
  pagination: BlogCommentsPagination;
}

export interface UserBlogsStats {
  total: number;
  published: number;
  drafts: number;
}

export interface MyBlogsResponse {
  blogs: Blog[];
  stats: UserBlogsStats;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

