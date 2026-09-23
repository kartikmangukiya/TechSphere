import { AppLayout } from "@/layouts/AppLayout";
import { About } from "@/pages/About";
import { Blogs } from "@/pages/Blogs";
import { Categories } from "@/pages/Categories";
import { Home } from "@/pages/Home";
import { LoginForm } from "@/pages/LoginForm";
import { RegisterForm } from "@/pages/RegisterForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "signin",
        element: <LoginForm />,
      },
      {
        path: "signup",
        element: <RegisterForm />,
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
