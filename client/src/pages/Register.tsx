import { useState } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const Register = () => {
  const [registerOpen, setRegisterOpen] = useState(true);

  return <RegisterForm open={registerOpen} onOpenChange={setRegisterOpen} />;
};
