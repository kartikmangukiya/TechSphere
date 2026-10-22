import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

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
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/formatters";
import { useNavigate, Link } from "react-router-dom";

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
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

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
      const user = await registerUser(values);

      setUser(user);
      reset();
      onOpenChange(false);
      navigate("/");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
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

            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="pr-10"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* API Error */}
          {errorMessage && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5">
              <p className="text-sm text-destructive font-medium" role="alert">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              onClick={() => onOpenChange(false)}
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
