import { LoginForm } from "@/components/auth/LoginForm";
import { useState } from "react";

export const Login = () => {
     const [loginOpen, setLoginOpen] = useState(true);
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <LoginForm open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};