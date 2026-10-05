import { AppLayout } from "@/layouts/AppLayout";
import { About } from "@/pages/About";
import { Blogs } from "@/pages/Blogs";
import { Home } from "@/pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { CreateBlog } from "@/pages/CreateBlog";

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
        path: "about",
        element: <About />,
      },
      {
        path: "signin",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      {
        path: "create-blog",
        element: <CreateBlog />,
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
