import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import PluginInstaller from "./pages/plugin-installer";
import ProjectCreator from "./pages/project-creator/project-maker";
import "./App.css";

import { Toaster } from "sonner";
import AppLayout from "./layouts/app-layout";
import ScriptRunner from "./pages/script-runner";
import AssetVault from "./pages/asset-vault";
import Profile from "./pages/profile";
import SettingsLayout from "./layouts/settings-layout";
import GeneralSettings from "./pages/settings/general-settings-page";
import UpdateSettings from "./pages/settings/updates-settings-page";
import DevelopersSettings from "./pages/settings/developers-settings-page";
import AboutSettings from "./pages/settings/about-settings-page";
import BlueprintEditor from "./pages/script-runner/blueprint";
import CustomTitleBar from "./components/custom-titlebar";
import NotFound from "./pages/error/not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true, // Default route (Dashboard)
        element: <Dashboard />,
      },
      {
        path: "installer",
        element: <PluginInstaller />,
      },
      {
        path: "project-create",
        element: <ProjectCreator />,
      },
      {
        path: "/settings",
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <GeneralSettings />,
          },
          {
            path: "updates",
            element: <UpdateSettings />,
          },
          {
            path: "advanced",
            element: <DevelopersSettings />,
          },
          {
            path: "about",
            element: <AboutSettings />,
          },
        ],
      },
      {
        path: "script-runner",
        element: <ScriptRunner />,
      },
      {
        path: "ae-asset-vault",
        element: <AssetVault />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "editor/blueprint",
        element: <BlueprintEditor />,
      },{
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
       <CustomTitleBar />
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
);
