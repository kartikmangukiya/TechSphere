import { LoginForm } from "@/components/auth/LoginForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const [loginOpen, setLoginOpen] = useState(true);

  const handleLoginOpenChange = (open: boolean) => {
    setLoginOpen(open);

    // When dialog is closed, go back to home
    if (!open) {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <LoginForm open={loginOpen} onOpenChange={handleLoginOpenChange} />
    </div>
  );
};
