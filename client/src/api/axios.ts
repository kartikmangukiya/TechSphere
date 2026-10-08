import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

interface RegisterUserData {
  name: string; 
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserData) => {
  const res = await API.post("/auth/register", {
    name,
    email,
    password,
  });

  return res.data;
};
