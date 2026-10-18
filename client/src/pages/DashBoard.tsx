import {
  FileText,
  PenLine,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const stats = [
  {
    title: "Total Blogs",
    value: "0",
    description: "All your articles",
    icon: FileText,
  },
  {
    title: "Published",
    value: "0",
    description: "Available to readers",
    icon: CheckCircle2,
  },
  {
    title: "Drafts",
    value: "0",
    description: "Work in progress",
    icon: FileEdit,
  },
];

const recentArticles = [
  {
    id: "1",
    title: "Building Modern React Applications with TypeScript",
    status: "published",
    updatedAt: "Oct 16, 2026",
  },
  {
    id: "2",
    title: "Understanding Angular Signals",
    status: "published",
    updatedAt: "Oct 14, 2026",
  },
  {
    id: "3",
    title: "Building REST APIs with Node.js",
    status: "draft",
    updatedAt: "Oct 12, 2026",
  },
  {
    id: "4",
    title: "Getting Started with TypeScript",
    status: "published",
    updatedAt: "Oct 10, 2026",
  },
];

export const Dashboard = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userInitials = (name || user?.name || "Developer")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    // Limit the image to 5 MB.
    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setProfileImage((previousImage) => {
      if (previousImage) URL.revokeObjectURL(previousImage);
      return imageUrl;
    });
  };

  const handleSaveProfile = () => {
    // Updates the local preview only.
    // Connect this handler to your profile-update API to save changes permanently.
    setIsEditProfileOpen(false);
  };

  const displayedName = name || user?.name || "Developer";
  const displayedEmail = email || user?.email || "";

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Developer"}!
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage your blog articals, track performance, and share your
              knowledge with the TechSphere community.
            </p>
          </div>

          <Button
            className="shrink-0 cursor-pointer"
            onClick={() => navigate("/create-blog")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </section>
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
            {/* Profile Image */}
            <div className="relative mx-auto sm:mx-0">
              <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
                <AvatarImage
                  src={profileImage ?? undefined}
                  alt={displayedName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                  {userInitials || "D"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Information */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="truncate text-lg font-semibold">
                  {displayedName}
                </h2>
              </div>

              <p className="mt-1 flex items-center justify-center gap-2 break-all text-sm text-muted-foreground sm:justify-start">
                <Mail className="h-4 w-4 shrink-0" />
                {displayedEmail || "Add your email"}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Welcome to your TechSphere dashboard.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex shrink-0 flex-wrap justify-center gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setIsViewProfileOpen(true)}
              >
                <UserRound className="mr-2 h-4 w-4" />
                View Profile
              </Button>

              <Button onClick={() => setIsEditProfileOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* View Profile Dialog */}
        <Dialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Profile</DialogTitle>
              <DialogDescription>
                View your TechSphere account information.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-4">
              <Avatar className="h-24 w-24 border">
                <AvatarImage
                  src={profileImage ?? undefined}
                  alt={displayedName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {userInitials || "D"}
                </AvatarFallback>
              </Avatar>

              <h3 className="mt-4 text-xl font-semibold">{displayedName}</h3>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                {displayedEmail || "No email available"}
              </p>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Username</p>
                  <p className="text-sm font-medium">{displayedName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="break-all text-sm font-medium">
                    {displayedEmail || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewProfileOpen(false)}
              >
                Close
              </Button>

              <Button
                onClick={() => {
                  setIsViewProfileOpen(false);
                  setIsEditProfileOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Edit Profile Dialog */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your display name, email, and profile picture.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Upload Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border">
                    <AvatarImage
                      src={profileImage ?? undefined}
                      alt={displayedName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                      {userInitials || "D"}
                    </AvatarFallback>
                  </Avatar>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90"
                    aria-label="Upload profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3 text-sm font-medium">Profile Picture</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG, or WebP · Maximum 5 MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="profile-name">Username</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveProfile}
                disabled={!name.trim() || !email.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's how your content is performing.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card key={stat.title}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>

                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>

                    <p className="mt-4 text-3xl font-bold">{stat.value}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        {/* Main Content */}
        <div className="mx-auto grid w-full max-w-7xl gap-8">
          {/* Recent Articles */}

          <section className="w-full space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">My Articles</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your recently updated content.
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <CardContent className="p-0">
                      {/* Blog Icon Area */}
                      <div className="relative flex h-36 items-center justify-center bg-muted/60">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background shadow-sm transition-transform duration-200 group-hover:scale-105">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute right-3 top-3">
                          <Badge
                            variant={
                              article.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {article.status === "published"
                              ? "Published"
                              : "Draft"}
                          </Badge>
                        </div>

                        {/* Actions Menu */}
                        <div className="absolute left-3 top-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 bg-background/80"
                                  aria-label={`Actions for ${article.title}`}
                                />
                              }
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => {
                                  // Add article edit navigation here.
                                }}
                              >
                                <PenLine className="mr-2 h-4 w-4" />
                                Edit article
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  // Add article details navigation here.
                                }}
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                View article
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Blog Details */}
                      <div className="space-y-3 p-4">
                        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 transition-colors group-hover:text-primary">
                          {article.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{article.updatedAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
};
