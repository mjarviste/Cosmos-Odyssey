import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TransportationApp from "../../routes/transporatationApp/TransportationApp";
import Layout from "../../routes/layout/layout";
import Reservations from "../../routes/reservations/Reservations";

const Router: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <TransportationApp />,
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
