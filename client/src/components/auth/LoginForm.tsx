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
import { loginUser } from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginForm = ({ open, onOpenChange }: LoginFormProps) => {
  const [errorMessage, setErrorMessage] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const user = await loginUser(values);

      // Immediately update the Navbar
      setUser(user);

      // Navigate after login
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  function handleDialogChange(nextOpen: boolean) {
    if (!nextOpen) {
      setErrorMessage("");
      reset();
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
          <DialogTitle>Welcome back</DialogTitle>
          ```
          <DialogDescription>
            Log in to your TechSphere account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>

            <Input
              id="login-email"
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
            <Label htmlFor="login-password">Password</Label>

            <Input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
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
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
