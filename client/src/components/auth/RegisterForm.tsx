import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/api/axios";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegisterForm = ({ open, onOpenChange }: RegisterFormProps) => {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setErrorMessage("");

    try {
      await registerUser(values);

      reset();
      onOpenChange(false);
    } catch {
      setErrorMessage(
        "Registration failed. Please check your details and try again.",
      );
    }
  }

  function handleDialogChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setErrorMessage("");
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      {" "}
      <DialogContent>
        {" "}
        <DialogHeader>
          {" "}
          <DialogTitle>Create an account</DialogTitle>
          ```
          <DialogDescription>
            Create your TechSphere account and join our community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="register-name">Name</Label>

            <Input
              id="register-name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>

            <Input
              id="register-email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>

            <Input
              id="register-password"
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* API Error */}
          {errorMessage && (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
