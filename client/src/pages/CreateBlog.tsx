import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API } from "@/api/axios";
import { getErrorMessage } from "@/lib/formatters";
import { toast } from "sonner";


const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const createBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(300, "Description must not exceed 300 characters"),
  tags: z.string().trim().min(2, "Please enter at least one tag"),
  image: z
    .custom<File | undefined>(
      (value) => value === undefined || (typeof File !== "undefined" && value instanceof File),
      "Please select a valid image file",
    )
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      "Image size must not exceed 5 MB",
    )
    .refine(
      (file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type),
      "Only JPG, PNG, and WebP images are allowed",
    ),
  content: z.string().trim().min(50, "Content must be at least 50 characters"),
  status: z.enum(["draft", "published"]),
});

type CreateBlogFormValues = z.infer<typeof createBlogSchema>;

export const CreateBlog = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CreateBlogFormValues>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      image: undefined,
      content: "",
      status: "draft",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedImage = form.watch("image");

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  const onSubmit = async (data: CreateBlogFormValues) => {
    form.clearErrors("root.serverError");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("content", data.content);
      formData.append("status", data.status);

      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      // The backend can parse this JSON string into an array of tags.
      formData.append("tags", JSON.stringify(tags));

      if (data.image) {
        // Must match upload.single("featuredImage") on the backend.
        formData.append("featuredImage", data.image);
      }

      const response = await API.post("/blogs", formData);

      console.log("Blog created successfully:", response.data);
      toast.success(
        data.status === "published"
          ? "Blog published successfully!"
          : "Blog saved as draft successfully!",
      );
      form.reset();
      navigate("/blogs");
    } catch (error: unknown) {
      console.error("Failed to create blog:", error);
      const message = getErrorMessage(error);
      form.setError("root.serverError", { message });
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create a Blog
          </h1>
          <p className="mt-2 text-muted-foreground">
            Share your knowledge and ideas with the TechSphere community.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your blog post.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(
                onSubmit,
                (errors) => console.error("Form validation errors:", errors),
              )}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your blog title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Write a short description of your blog..."
                  className="min-h-28 resize-none"
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-sm text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="react, javascript, frontend"
                  {...form.register("tags")}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple tags with commas.
                </p>
                {form.formState.errors.tags && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.tags.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    form.setValue("image", file, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Select a JPG, PNG, or WebP image. Maximum size: 5 MB.
                </p>
                {form.formState.errors.image && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.image.message}
                  </p>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Blog image preview"
                      className="h-56 w-full rounded-lg border object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content..."
                  className="min-h-75 resize-y"
                  {...form.register("content")}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>

              {form.formState.errors.root?.serverError && (
                <p role="alert" className="text-sm text-destructive">
                  {form.formState.errors.root.serverError.message}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    const fileInput = document.getElementById(
                      "image",
                    ) as HTMLInputElement | null;
                    if (fileInput) fileInput.value = "";
                  }}
                >
                  Reset
                </Button>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Blog"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
