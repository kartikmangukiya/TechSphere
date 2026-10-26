import axios from "axios";
import type {
  ApiResponse,
  Blog,
  BlogAuthor,
  BlogComment,
  BlogCommentsResponse,
  BlogLikeSummary,
  BlogListData,
  BlogStatus,
  MyBlogsResponse,
  UserBlogsStats,
} from "@/types/blog";

export const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

// Attach Authorization header if token exists in localStorage (supports dual cookie/Bearer auth)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("techsphere_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Re-export shared types for convenience
export type {
  ApiResponse,
  Blog,
  BlogAuthor,
  BlogComment,
  BlogCommentsResponse,
  BlogFilterParams,
  BlogLikeSummary,
  BlogListData,
  BlogStatus,
  GetAllBlogsResult,
  MyBlogsResponse,
  UserBlogsStats,
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  token?: string;
}

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserData): Promise<AuthUser> => {
  const res = await API.post<ApiResponse<AuthUser>>("/auth/register", {
    name,
    email,
    password,
  });

  const userData = res.data.data;
  if (userData?.token) {
    localStorage.setItem("techsphere_token", userData.token);
  }

  return userData;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthUser> => {
  const response = await API.post<ApiResponse<AuthUser>>(
    "/auth/login",
    credentials,
  );

  const userData = response.data.data;
  if (userData?.token) {
    localStorage.setItem("techsphere_token", userData.token);
  }

  return userData;
};

export const forgotPassword = async (data: {
  email: string;
  newPassword: string;
}): Promise<{ email: string }> => {
  const response = await API.post<ApiResponse<{ email: string }>>(
    "/auth/forgot-password",
    data,
  );
  return response.data.data;
};

export const getMe = async (): Promise<AuthUser> => {
  const response = await API.get<ApiResponse<AuthUser>>("/auth/me");
  return response.data.data;
};

export const updateProfile = async (
  data:
    | FormData
    | {
      name?: string;
      email?: string;
      removeProfileImage?: boolean | string;
    },
): Promise<AuthUser> => {
  const response = await API.patch<ApiResponse<AuthUser>>(
    "/auth/profile",
    data,
  );
  return response.data.data;
};

export const logoutUser = async () => {
  try {
    const response = await API.post("/auth/logout");
    return response.data;
  } finally {
    localStorage.removeItem("techsphere_token");
  }
};

export interface CreateBlogResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Blog;
}

export const createBlog = async (
  formData: FormData,
): Promise<CreateBlogResponse> => {
  const response = await API.post<CreateBlogResponse>("/blogs", formData);
  return response.data;
};

export const getAllBlogs = async (
  params?: BlogFilterParams,
): Promise<GetAllBlogsResult> => {
  const response = await API.get<ApiResponse<Blog[] | BlogListData>>("/blogs", {
    params,
  });
  const result = response.data.data;

  // Support APIs returning either an array or { blogs: [...], tags: [...] }
  if (Array.isArray(result)) {
    return { blogs: result, tags: [] };
  }

  return {
    blogs: result.blogs || [],
    tags: result.tags || [],
    total: result.pagination?.totalBlogs ?? result.total ?? result.blogs?.length,
    pagination: result.pagination,
  };
};

export const getMyBlogs = async (
  status?: "all" | "published" | "draft",
  search?: string,
): Promise<MyBlogsResponse> => {
  const params: Record<string, string> = {};
  if (status && status !== "all") {
    params.status = status;
  }
  if (search && search.trim()) {
    params.search = search.trim();
  }

  const response = await API.get<ApiResponse<MyBlogsResponse>>(
    "/blogs/user/my-blogs",
    { params },
  );

  return response.data.data;
};

export const getBlogById = async (id: string): Promise<Blog> => {
  const response = await API.get<ApiResponse<Blog>>(`/blogs/${id}`);
  return response.data.data;
};

export const updateBlog = async (
  blogId: string,
  formData: FormData | Partial<Blog>,
): Promise<Blog> => {
  const response = await API.patch<ApiResponse<Blog>>(
    `/blogs/${blogId}`,
    formData,
  );
  return response.data.data;
};

export const deleteBlog = async (
  blogId: string,
): Promise<{ deleted: boolean }> => {
  await API.delete<ApiResponse<null>>(`/blogs/${blogId}`);
  return { deleted: true };
};

// GET: Fetch likes and current user's like status
export const getBlogLikes = async (
  blogId: string,
): Promise<BlogLikeSummary> => {
  const response = await API.get<ApiResponse<BlogLikeSummary>>(
    `/blogs/${blogId}/likes`,
  );
  return response.data.data;
};

// POST: Like a blog
export const likeBlog = async (
  blogId: string,
): Promise<BlogLikeSummary> => {
  const response = await API.post<ApiResponse<BlogLikeSummary>>(
    `/blogs/${blogId}/like`,
  );
  return response.data.data;
};

// DELETE: Unlike a blog
export const unlikeBlog = async (
  blogId: string,
): Promise<BlogLikeSummary> => {
  const response = await API.delete<ApiResponse<BlogLikeSummary>>(
    `/blogs/${blogId}/like`,
  );
  return response.data.data;
};

// GET: Fetch blog comments
export const getBlogComments = async (
  blogId: string,
  page = 1,
  limit = 10,
): Promise<BlogCommentsResponse> => {
  const response = await API.get<ApiResponse<BlogCommentsResponse>>(
    `/blogs/${blogId}/comments`,
    {
      params: { page, limit },
    },
  );
  return response.data.data;
};

// POST: Create a comment
export const createBlogComment = async (
  blogId: string,
  content: string,
): Promise<BlogComment> => {
  const response = await API.post<ApiResponse<BlogComment>>(
    `/blogs/${blogId}/comments`,
    {
      content,
    },
  );
  return response.data.data;
};

// DELETE: Delete a comment
export const deleteBlogComment = async (
  blogId: string,
  commentId: string,
): Promise<{ commentId: string; deleted: boolean }> => {
  const response = await API.delete<
    ApiResponse<{ commentId: string; deleted: boolean }>
  >(`/blogs/${blogId}/comments/${commentId}`);
  return response.data.data;
};

export interface SubscribeResponse {
  success: boolean;
  message: string;
}

export const subscribeEmail = async (
  email: string,
): Promise<SubscribeResponse> => {
  const response = await API.post<SubscribeResponse>(
    "/subscribe",
    { email },
  );

  return response.data;
};