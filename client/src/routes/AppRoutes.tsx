import { AppLayout } from "@/layouts/AppLayout";
import { About } from "@/pages/About";
import { Blogs } from "@/pages/Blogs";
import { Home } from "@/pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { CreateBlog } from "@/pages/CreateBlog";
import { Dashboard } from "@/pages/DashBoard";
import { SingalBlog } from "@/pages/SingalBlog";

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
        path: "/blogs/:id",
        element: <SingalBlog />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "signin",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <Login initialView="forgot-password" />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      {
        path: "create-blog",
        element: <CreateBlog />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
