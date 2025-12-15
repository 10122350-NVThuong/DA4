import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { RouterProvider } from "react-router-dom";
import { createRouterConfig } from "./routes";
import { NotifyProvider } from "./components/notification/NotifyProvider";

const router = createRouterConfig();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotifyProvider>
        <RouterProvider router={router} />
      </NotifyProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
