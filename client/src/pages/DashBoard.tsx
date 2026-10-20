import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  Camera,
  Mail,
  Pencil,
  Clock,
  CheckCircle2,
  FileEdit,
  BookOpen,
  MoreHorizontal,
  UserRound,
  Trash2,
  Search,
  RefreshCw,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuth } from "@/context/AuthContext";
import {
  getMyBlogs,
  updateBlog,
  deleteBlog,
  updateProfile,
  type Blog,
  type BlogStatus,
} from "@/api/axios";
import { formatDate, getErrorMessage } from "@/lib/formatters";

type FilterStatus = "all" | "published" | "draft";

export const Dashboard = () => {
  const { user, setUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filters & Search
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Profile Dialogs
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(user?.name ?? "");
  const [profileEmail, setProfileEmail] = useState(user?.email ?? "");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    user?.profileImage || null,
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Blog Dialog
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isEditBlogOpen, setIsEditBlogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState<BlogStatus>("draft");
  const [editTags, setEditTags] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Blog Dialog
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Sync profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfileImagePreview(user.profileImage || null);
      setProfileImageFile(null);
      setIsRemovingImage(false);
    }
  }, [user]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.warning("Please sign in to access your dashboard.");
      navigate("/signin");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // Fetch user blogs and stats
  const {
    data: myBlogsData,
    isLoading: isBlogsLoading,
    isError: isBlogsError,
    error: blogsError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["my-blogs", filterStatus, searchQuery],
    queryFn: () => getMyBlogs(filterStatus, searchQuery),
    enabled: Boolean(user),
  });

  const blogs = myBlogsData?.blogs ?? [];
  const stats = myBlogsData?.stats ?? { total: 0, published: 0, drafts: 0 };

  // Profile Initials
  const userInitials = (profileName || user?.name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  // Handle profile image file selection
  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setProfileImageFile(file);
    setIsRemovingImage(false);

    if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profileImagePreview);
    }
    const imageUrl = URL.createObjectURL(file);
    setProfileImagePreview(imageUrl);
    event.target.value = "";
  };

  // Remove profile image
  const handleRemoveProfileImage = () => {
    if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profileImagePreview);
    }
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setIsRemovingImage(true);
    if (profileFileInputRef.current) {
      profileFileInputRef.current.value = "";
    }
    toast.info("Profile photo marked for removal. Click Save Changes to apply.");
  };

  // Undo remove profile image
  const handleUndoRemoveProfileImage = () => {
    setIsRemovingImage(false);
    setProfileImagePreview(user?.profileImage || null);
    setProfileImageFile(null);
  };

  // Open Edit Profile modal with fresh state
  const handleOpenEditProfile = () => {
    setProfileName(user?.name ?? "");
    setProfileEmail(user?.email ?? "");
    setProfileImagePreview(user?.profileImage || null);
    setProfileImageFile(null);
    setIsRemovingImage(false);
    setIsEditProfileOpen(true);
  };

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setProfileImagePreview(updatedUser.profileImage || null);
      setProfileImageFile(null);
      setIsRemovingImage(false);
      setIsEditProfileOpen(false);
      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleSaveProfile = () => {
    if (!profileName.trim() || !profileEmail.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", profileName.trim());
    formData.append("email", profileEmail.trim());

    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    } else if (isRemovingImage) {
      formData.append("removeProfileImage", "true");
    }

    profileMutation.mutate(formData);
  };

  // Open Edit Blog Dialog
  const handleOpenEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
    setEditContent(blog.content);
    setEditStatus(blog.status || "draft");
    setEditTags(blog.tags ? blog.tags.join(", ") : "");
    setEditImageFile(null);
    setEditImagePreview(blog.featuredImage || null);
    setIsEditBlogOpen(true);
  };

  // Handle featured image change for blog
  const handleEditBlogImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setEditImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setEditImagePreview(previewUrl);
  };

  // Update Blog Mutation
  const updateBlogMutation = useMutation({
    mutationFn: async ({
      blogId,
      formData,
    }: {
      blogId: string;
      formData: FormData;
    }) => updateBlog(blogId, formData),
    onSuccess: () => {
      setIsEditBlogOpen(false);
      setEditingBlog(null);
      toast.success("Article updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleSaveEditBlog = () => {
    if (!editingBlog) return;

    const trimmedTitle = editTitle.trim();
    const trimmedDesc = editDescription.trim();
    const trimmedContent = editContent.trim();

    if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
      toast.error("Title must be between 5 and 100 characters.");
      return;
    }

    if (trimmedDesc.length < 20 || trimmedDesc.length > 300) {
      toast.error("Description must be between 20 and 300 characters.");
      return;
    }

    if (trimmedContent.length < 50) {
      toast.error("Content must be at least 50 characters.");
      return;
    }

    const formData = new FormData();
    formData.append("title", trimmedTitle);
    formData.append("description", trimmedDesc);
    formData.append("content", trimmedContent);
    formData.append("status", editStatus);

    const parsedTags = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    formData.append("tags", JSON.stringify(parsedTags));

    if (editImageFile) {
      formData.append("featuredImage", editImageFile);
    }

    updateBlogMutation.mutate({ blogId: editingBlog._id, formData });
  };

  // Delete Blog Mutation
  const deleteBlogMutation = useMutation({
    mutationFn: (blogId: string) => deleteBlog(blogId),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setDeletingBlog(null);
      toast.success("Article deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleConfirmDelete = () => {
    if (!deletingBlog) return;
    deleteBlogMutation.mutate(deletingBlog._id);
  };

  return (
    <main className="min-h-screen bg-muted/30 pb-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Author"}!
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your blog articles, review analytics, and create new content.
            </p>
          </div>

          <Button
            className="shrink-0 cursor-pointer shadow-sm"
            onClick={() => navigate("/create-blog")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </section>

        {/* User Profile Card */}
        <Card className="overflow-hidden border shadow-sm">
          <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative mx-auto sm:mx-0">
              <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
                <AvatarImage
                  src={user?.profileImage || undefined}
                  alt={user?.name || "Author"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                  {userInitials || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="truncate text-lg font-semibold">
                  {user?.name || "Author"}
                </h2>
                <Badge variant="outline" className="text-xs">
                  Author
                </Badge>
              </div>

              <p className="mt-1 flex items-center justify-center gap-2 break-all text-sm text-muted-foreground sm:justify-start">
                <Mail className="h-4 w-4 shrink-0" />
                {user?.email || "No email provided"}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Author Dashboard · TechSphere Community
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-wrap justify-center gap-2 sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsViewProfileOpen(true)}
                className="cursor-pointer"
              >
                <UserRound className="mr-2 h-4 w-4" />
                View Profile
              </Button>

              <Button
                size="sm"
                onClick={handleOpenEditProfile}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats Cards */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="text-sm text-muted-foreground">
              Summary of all your published articles and drafts.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {/* Total Blogs */}
            <Card
              className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm ${
                filterStatus === "all" ? "ring-2 ring-primary/20 border-primary" : ""
              }`}
              onClick={() => setFilterStatus("all")}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Articles
                  </p>
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight">
                  {isBlogsLoading ? "..." : stats.total}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  All articles written by you
                </p>
              </CardContent>
            </Card>

            {/* Published */}
            <Card
              className={`cursor-pointer transition-all hover:border-emerald-500/50 hover:shadow-sm ${
                filterStatus === "published" ? "ring-2 ring-emerald-500/20 border-emerald-500" : ""
              }`}
              onClick={() => setFilterStatus("published")}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Published
                  </p>
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-600">
                  {isBlogsLoading ? "..." : stats.published}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Live and visible to all readers
                </p>
              </CardContent>
            </Card>

            {/* Drafts */}
            <Card
              className={`cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-sm ${
                filterStatus === "draft" ? "ring-2 ring-amber-500/20 border-amber-500" : ""
              }`}
              onClick={() => setFilterStatus("draft")}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Drafts
                  </p>
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                    <FileEdit className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-amber-600">
                  {isBlogsLoading ? "..." : stats.drafts}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Work in progress (private)
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* My Articles Section with Filters */}
        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Articles</h2>
              <p className="text-sm text-muted-foreground">
                Manage, edit, publish, or delete your content.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Pills */}
              <div className="inline-flex rounded-lg border bg-background p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterStatus("all")}
                  className={`rounded-md px-3 py-1.5 font-medium transition cursor-pointer ${
                    filterStatus === "all"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({stats.total})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterStatus("published")}
                  className={`rounded-md px-3 py-1.5 font-medium transition cursor-pointer ${
                    filterStatus === "published"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Published ({stats.published})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterStatus("draft")}
                  className={`rounded-md px-3 py-1.5 font-medium transition cursor-pointer ${
                    filterStatus === "draft"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Drafts ({stats.drafts})
                </button>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => void refetch()}
                disabled={isFetching}
                title="Refresh articles"
                aria-label="Refresh articles"
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your articles by title or keywords..."
              className="pl-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Error Message */}
          {isBlogsError && (
            <Card className="border-red-500/30 bg-red-500/10 p-5">
              <p className="text-sm text-red-600">
                Failed to load your articles: {getErrorMessage(blogsError)}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void refetch()}
                className="mt-3 cursor-pointer"
              >
                Try again
              </Button>
            </Card>
          )}

          {/* Loading Skeleton */}
          {isBlogsLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <Skeleton className="h-44 w-full" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isBlogsLoading && !isBlogsError && blogs.length === 0 && (
            <Card className="border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {searchQuery
                  ? "No articles matched your search"
                  : filterStatus === "published"
                  ? "No published articles yet"
                  : filterStatus === "draft"
                  ? "No drafts found"
                  : "No articles created yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms or clearing the filter."
                  : "Start sharing your knowledge, ideas, and engineering insights with the community."}
              </p>
              <Button
                className="mt-6 cursor-pointer"
                onClick={() => navigate("/create-blog")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Article
              </Button>
            </Card>
          )}

          {/* Articles Grid */}
          {!isBlogsLoading && !isBlogsError && blogs.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((article) => {
                const isPublished = article.status === "published";

                return (
                  <Card
                    key={article._id}
                    className="group flex h-full flex-col overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative">
                      {/* Featured Image */}
                      {article.featuredImage ? (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                      ) : (
                        <div className="flex h-44 items-center justify-center bg-muted/60">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-background shadow-xs">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute right-3 top-3">
                        <Badge
                          variant={isPublished ? "default" : "secondary"}
                          className={
                            isPublished
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400"
                          }
                        >
                          {isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>

                      {/* Dropdown Actions */}
                      <div className="absolute left-3 top-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-background/90 backdrop-blur shadow-xs cursor-pointer hover:bg-background"
                                aria-label={`Actions for ${article.title}`}
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuItem
                              onClick={() => navigate(`/blogs/${article._id}`)}
                              className="cursor-pointer"
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              View article
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleOpenEditBlog(article)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit article
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingBlog(article);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete article
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Blog Info */}
                    <CardContent className="flex flex-1 flex-col justify-between p-5">
                      <div className="space-y-2">
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                          {article.title}
                        </h3>

                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {article.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Updated {formatDate(article.updatedAt || article.createdAt)}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenEditBlog(article)}
                          className="font-medium text-primary hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* EDIT BLOG DIALOG */}
        {/* ======================================================== */}
        <Dialog open={isEditBlogOpen} onOpenChange={setIsEditBlogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
              <DialogDescription>
                Update your blog post details, change publication status, or upload a new featured image.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter a compelling title..."
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {editTitle.length}/100 characters (min. 5)
                </p>
              </div>

              {/* Status & Tags in a row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(val) => setEditStatus(val as BlogStatus)}
                  >
                    <SelectTrigger id="edit-status" className="cursor-pointer">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft (Private)</SelectItem>
                      <SelectItem value="published">Published (Public)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                  <Input
                    id="edit-tags"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="react, typescript, web"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label htmlFor="edit-image">Featured Image</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editFileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose New Image
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    JPG, PNG, WebP · Max 5 MB
                  </span>
                </div>

                <input
                  ref={editFileInputRef}
                  id="edit-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleEditBlogImageChange}
                />

                {editImagePreview && (
                  <div className="relative mt-2 overflow-hidden rounded-lg border">
                    <img
                      src={editImagePreview}
                      alt="Featured preview"
                      className="h-44 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditImageFile(null);
                        setEditImagePreview(null);
                      }}
                      className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Short summary of the article..."
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground">
                  {editDescription.length}/300 characters (min. 20)
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Full markdown/text content..."
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  {editContent.length} characters (min. 50)
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsEditBlogOpen(false)}
                disabled={updateBlogMutation.isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveEditBlog}
                disabled={updateBlogMutation.isPending}
                className="cursor-pointer"
              >
                {updateBlogMutation.isPending ? "Saving changes..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ======================================================== */}
        {/* DELETE BLOG CONFIRMATION DIALOG */}
        {/* ======================================================== */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Delete Article
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  "{deletingBlog?.title}"
                </span>
                ? This action cannot be undone and will permanently remove this post and all associated comments.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteBlogMutation.isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteBlogMutation.isPending}
                className="cursor-pointer"
              >
                {deleteBlogMutation.isPending ? "Deleting..." : "Delete Permanently"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ======================================================== */}
        {/* VIEW PROFILE DIALOG */}
        {/* ======================================================== */}
        <Dialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Profile</DialogTitle>
              <DialogDescription>
                View your TechSphere author account information.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-4">
              <Avatar className="h-24 w-24 border">
                <AvatarImage
                  src={user?.profileImage || undefined}
                  alt={user?.name || "Author"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {userInitials || "U"}
                </AvatarFallback>
              </Avatar>

              <h3 className="mt-4 text-xl font-semibold">
                {user?.name || "Author"}
              </h3>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                {user?.email || "No email available"}
              </p>
            </div>

            <div className="space-y-3 rounded-lg border p-4 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Total Articles</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Published</span>
                <span className="font-semibold text-emerald-600">{stats.published}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Drafts</span>
                <span className="font-semibold text-amber-600">{stats.drafts}</span>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewProfileOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>

              <Button
                onClick={() => {
                  setIsViewProfileOpen(false);
                  handleOpenEditProfile();
                }}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ======================================================== */}
        {/* EDIT PROFILE DIALOG */}
        {/* ======================================================== */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your display name and email address.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Avatar upload */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border">
                    <AvatarImage
                      src={profileImagePreview ?? undefined}
                      alt={profileName || "Author"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                      {userInitials || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <button
                    type="button"
                    onClick={() => profileFileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 cursor-pointer"
                    aria-label="Upload profile picture"
                    title="Upload or change profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => profileFileInputRef.current?.click()}
                    className="h-8 text-xs cursor-pointer"
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    {profileImagePreview ? "Change Photo" : "Upload Photo"}
                  </Button>

                  {profileImagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveProfileImage}
                      className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Remove Photo
                    </Button>
                  )}

                  {isRemovingImage && !profileImagePreview && user?.profileImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleUndoRemoveProfileImage}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Undo Remove
                    </Button>
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  JPG, PNG, or WebP · Max 5 MB
                </p>

                <input
                  ref={profileFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="profile-name">Display Name</Label>
                <Input
                  id="profile-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email Address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditProfileOpen(false)}
                disabled={profileMutation.isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveProfile}
                disabled={
                  profileMutation.isPending ||
                  !profileName.trim() ||
                  !profileEmail.trim()
                }
                className="cursor-pointer"
              >
                {profileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};
