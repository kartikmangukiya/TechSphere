import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const Register = () => {
  const [registerOpen, setRegisterOpen] = useState(true);
  const navigate = useNavigate();

  const handleRegisterOpenChange = (open: boolean) => {
    setRegisterOpen(open);

    // When dialog is closed, go back to home
    if (!open) {
      navigate("/");
    }
  };

  return (
    <RegisterForm open={registerOpen} onOpenChange={handleRegisterOpenChange} />
  );
};
