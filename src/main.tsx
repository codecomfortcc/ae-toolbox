import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import PluginInstaller from "./pages/plugin-installer";
import ProjectCreator from "./pages/project-maker";
import "./App.css";

import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/installer",
    element: <PluginInstaller />,
  },
  {
    path: "/project-create",
    element: <ProjectCreator />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
   <React.StrictMode>
    <RouterProvider router={router} />
     <Toaster />
   </React.StrictMode>
);
