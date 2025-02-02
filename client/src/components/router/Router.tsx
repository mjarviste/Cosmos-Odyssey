import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Prices from "../../routes/prices/prices";
import Layout from "../../routes/layout/layout";
import Reservations from "../../routes/reservations/reservations";

const Router: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Prices />,
        },
        {
          path: "/reservations",
          element: <Reservations />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
