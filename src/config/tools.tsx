import React from 'react';
import { Puzzle, Rocket,  Terminal, CloudLightning } from "lucide-react";

export type ToolConfig = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  // New fields for flexibility
  category: "Deployment" | "Development" | "Utility";
  shortcut: string;
  stats?: string; 
  status: "active" | "beta" | "maintenance";
};

export const TOOLS: ToolConfig[] = [
  {
    id: "installer",
    title: "Plugin Installer",
    desc: "Deploy JSX, AEX, ZXP & UXP assets securely across instances.",
    icon: <Puzzle className="w-6 h-6" />,
    path: "/installer",
    color: "from-purple-500/20 to-purple-500/0 border-purple-500/20",
    category: "Deployment",
    shortcut: "⌘ 1",
    stats: "12 Installed",
    status: "active",
  },
  {
    id: "project-creator",
    title: "Project Creator",
    desc: "Scaffold standardized AE project structures with template injection.",
    icon: <Rocket className="w-6 h-6" />,
    path: "/project-create",
    color: "from-blue-500/20 to-blue-500/0 border-blue-500/20",
    category: "Development",
    shortcut: "⌘ 2",
    stats: "3 Templates",
    status: "beta",
  },
  {
    id: "script-runner",
    title: "Script Runner",
    desc: "JIT execution of .jsx files in a sandboxed environment.",
    icon: <Terminal className="w-6 h-6" />,
    path: "/runner",
    color: "from-emerald-500/20 to-emerald-500/0 border-emerald-500/20",
    category: "Utility",
    shortcut: "⌘ 3",
    status: "maintenance",
  },
  // Added a dummy tool to show layout flexibility
  {
    id: "asset-manager",
    title: "Asset Cloud",
    desc: "Sync presets and expressions with remote storage.",
    icon: <CloudLightning className="w-6 h-6" />,
    path: "/assets",
    color: "from-amber-500/20 to-amber-500/0 border-amber-500/20",
    category: "Utility",
    shortcut: "⌘ 4",
    stats: "Syncing...",
    status: "active",
  },
];
