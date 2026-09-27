import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

// ------------------------------------
// Validation Schema
// ------------------------------------

const createBlogSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(300, "Description must not exceed 300 characters"),

  category: z.string().min(1, "Please select a category"),

  tags: z.string().min(2, "Please enter at least one tag"),

  image: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),

  content: z.string().min(50, "Content must be at least 50 characters"),

  status: z.enum(["draft", "published"]),
});

// ------------------------------------
// Type
// ------------------------------------

type CreateBlogFormValues = z.infer<typeof createBlogSchema>;

// ------------------------------------
// Categories
// ------------------------------------

const categories = [
  {
    value: "programming-languages",
    label: "Programming Languages",
  },
  {
    value: "database",
    label: "Database",
  },
  {
    value: "ai-machine-learning",
    label: "AI & Machine Learning",
  },
  {
    value: "devops-cloud",
    label: "DevOps & Cloud",
  },
  {
    value: "tools-productivity",
    label: "Tools & Productivity",
  },
  {
    value: "cybersecurity",
    label: "Cybersecurity",
  },
  {
    value: "product-development",
    label: "Product Development",
  },
  {
    value: "data-structures-algorithms",
    label: "Data Structures & Algorithms",
  },
];

// ------------------------------------
// Component
// ------------------------------------

export const CreateBlog = () => {
  const form = useForm<CreateBlogFormValues>({
    resolver: zodResolver(createBlogSchema),

    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      image: "",
      content: "",
      status: "draft",
    },
  });

  // ------------------------------------
  // Submit
  // ------------------------------------

  const onSubmit = (data: CreateBlogFormValues) => {
    console.log("Blog Data:", data);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create a Blog
          </h1>

          <p className="mt-2 text-muted-foreground">
            Share your knowledge and ideas with the TechSphere community.
          </p>
        </div>

        {/* Blog Card */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>

            <CardDescription>
              Fill in the information below to create your blog post.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* -------------------------------- */}
              {/* Title */}
              {/* -------------------------------- */}

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

              {/* -------------------------------- */}
              {/* Description */}
              {/* -------------------------------- */}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  placeholder="Write a short description of your blog..."
                  className="min-h-27.5 resize-none"
                  {...form.register("description")}
                />

                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* -------------------------------- */}
              {/* Category + Status */}
              {/* -------------------------------- */}

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Category */}

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>

                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>

                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
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
                {/* Status */}

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>

                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
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
              </div>

              {/* -------------------------------- */}
              {/* Tags */}
              {/* -------------------------------- */}

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

              {/* -------------------------------- */}
              {/* Featured Image */}
              {/* -------------------------------- */}

              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>

                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...form.register("image")}
                />

                {form.formState.errors.image && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>

              {/* -------------------------------- */}
              {/* Content */}
              {/* -------------------------------- */}

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

              {/* -------------------------------- */}
              {/* Actions */}
              {/* -------------------------------- */}

              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>

                <Button type="submit">Create Blog</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
