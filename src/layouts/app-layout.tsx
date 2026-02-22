import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Puzzle,
  Rocket,
  Settings,

  Terminal as TerminalIcon,
  CloudLightning,
  User,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAppStore } from "../store/use-appstore";
import icon from "@/assets/icon.png";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { init, settings } = useAppStore();

  // --- THE THEME INJECTOR ---
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Inject the accent color data attribute
    root.setAttribute("data-accent", settings.accentColor);
    
    // Handle dark mode toggle
    if (settings.themeMode === "dark") {
      root.classList.add("dark");
    } else if (settings.themeMode === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [settings.accentColor, settings.themeMode]);
  // --------------------------

  const NAV_ITEMS = [
    { path: "/", icon: LayoutGrid, label: "Dashboard" },
    { path: "/installer", icon: Puzzle, label: "Installer" },
    { path: "/project-create", icon: Rocket, label: "Creator" },
    { path: "/script-runner", icon: TerminalIcon, label: "Script Runner" },
    { path: "/ae-asset-vault", icon: CloudLightning, label: "Asset Vault" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-hidden pt-10">
   
      {/* --- GLOBAL STATIC SIDEBAR --- */}
      <div className="w-20 border-r border-border bg-sidebar flex flex-col items-center py-8 gap-8 z-50">
        
        {/* App Logo */}
        <div className=" bg-card rounded-xl border border-border shadow-lg mb-4">
          <img src={icon} alt="Logo" className="w-10 h-10" />
        </div>

        {/* Navigation Rail */}
        <nav className="flex flex-col gap-4 w-full px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={item.label}
                className={`
                    p-3 rounded-xl transition-all duration-300 relative group
                    ${isActive
                        ? "bg-secondary text-secondary-foreground shadow-[0_0_15px_-3px_var(--color-primary)]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
              >
                <item.icon size={20} />

                {/* Tooltip on Hover */}
                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover border border-border px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </span>

                {/* Active Dot */}
                {isActive && (
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="flex flex-col gap-4 w-full px-4 mt-auto items-center">
          <button
            onClick={() => navigate("/settings")}
            title="Settings"
            className={`
                p-3 rounded-xl transition-all duration-300 relative group
                ${location.pathname === "/settings"
                    ? "bg-secondary text-secondary-foreground shadow-[0_0_15px_-3px_var(--color-primary)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
          >
            <Settings size={20} />
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover border border-border px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Settings
            </span>
            {location.pathname === "/settings" && (
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
            )}
          </button>
          
          <div className="px-0.5">
            <Button
              onClick={() => navigate("/profile")}
              size="icon-lg"
              className="bg-primary text-primary-foreground hover:opacity-90 rounded-full w-10 h-10 flex items-center justify-center p-0"
            >
              <User size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* --- DYNAMIC CONTENT AREA --- */}
      <main className="flex-1 overflow-hidden relative bg-background">
        <Outlet />
      </main>
    </div>
  );
}
