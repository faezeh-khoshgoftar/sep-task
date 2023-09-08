import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Profile from "./components/Profile";
import Users from "./components/Users";
import ErrorPage from "./ErrorPage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/register",
      element: <Register />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "users",
          element: <Users />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
