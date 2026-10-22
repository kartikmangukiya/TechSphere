import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

interface LoginProps {
  initialView?: "login" | "forgot-password";
}

export const Login = ({ initialView = "login" }: LoginProps) => {
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState<"login" | "forgot-password">(
    initialView,
  );
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleModalClose = (open: boolean) => {
    if (!open) {
      navigate("/");
    }
  };

  const handleForgotPassword = (currentEmail?: string) => {
    if (currentEmail) {
      setEmail(currentEmail);
    }
    setSuccessMessage("");
    setActiveView("forgot-password");
  };

  const handleBackToLogin = () => {
    setActiveView("login");
  };

  const handleResetSuccess = (userEmail: string) => {
    if (userEmail) {
      setEmail(userEmail);
    }
    setSuccessMessage(
      "Password reset successfully! You can now log in with your new password.",
    );
    setActiveView("login");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      {activeView === "login" ? (
        <LoginForm
          open={true}
          onOpenChange={handleModalClose}
          onForgotPassword={handleForgotPassword}
          initialEmail={email}
          successMessage={successMessage}
        />
      ) : (
        <ForgotPasswordForm
          open={true}
          onOpenChange={handleModalClose}
          onBackToLogin={handleBackToLogin}
          onSuccess={handleResetSuccess}
          initialEmail={email}
        />
      )}
    </div>
  );
};
