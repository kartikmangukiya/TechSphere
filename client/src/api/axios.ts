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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthUser> => {
  const response = await API.post<ApiResponse<AuthUser>>(
    "/auth/login",
    credentials,
  );

  return response.data.data;
};
export const getMe = async (): Promise<AuthUser> => {
  const response = await API.get<ApiResponse<AuthUser>>("/auth/me");

  return response.data.data;
};
export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};
