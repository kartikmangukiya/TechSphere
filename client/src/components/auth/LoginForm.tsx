import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

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
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from "@/lib/formatters";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onForgotPassword?: (currentEmail?: string) => void;
  initialEmail?: string;
  successMessage?: string;
}

export const LoginForm = ({
  open,
  onOpenChange,
  onForgotPassword,
  initialEmail = "",
  successMessage = "",
}: LoginFormProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: initialEmail,
      password: "",
    },
  });

  useEffect(() => {
    if (initialEmail) {
      setValue("email", initialEmail);
    }
  }, [initialEmail, setValue]);

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage("");
    try {
      const user = await loginUser(values);

      // Immediately update the Navbar
      setUser(user);
      toast.success("Logged in successfully!");

      // Navigate after login
      navigate("/");
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    }
  };

  function handleDialogChange(nextOpen: boolean) {
    if (!nextOpen) {
      setErrorMessage("");
      reset();
    }

    onOpenChange(nextOpen);
  }

  const handleForgotPasswordClick = () => {
    const currentEmail = getValues("email");
    if (onForgotPassword) {
      onForgotPassword(currentEmail);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>
            Log in to your TechSphere account.
          </DialogDescription>
        </DialogHeader>

        {/* Success Notice (e.g. from password reset) */}
        {successMessage && (
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

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
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-xs font-medium text-primary hover:underline cursor-pointer focus:outline-none"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
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
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              onClick={() => onOpenChange(false)}
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
