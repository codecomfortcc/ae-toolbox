import { useEffect } from "react"; // <-- 1. Import useEffect
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  ChevronLeft,
  Settings as SettingsIcon,
  Monitor,
  RefreshCw,
  Terminal,
  Shield,
} from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";

const TABS = [
  { id: "general", path: "/settings", label: "General", icon: Monitor },
  {
    id: "updates",
    path: "/settings/updates",
    label: "Updates",
    icon: RefreshCw,
  },
  {
    id: "advanced",
    path: "/settings/advanced",
    label: "Developer",
    icon: Terminal,
  },
  { id: "about", path: "/settings/about", label: "About", icon: Shield },
];

export default function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.replace(/\/$/, "");

  // --- 2. THE SCROLL RESET LOGIC ---
  useEffect(() => {
    // Radix UI (which Shadcn uses) puts the scrolling on this specific element
    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname]); // This fires every time the URL changes!
  // ---------------------------------

  return (
    <div className="flex flex-col md:flex-row h-full bg-background text-foreground overflow-hidden w-full relative">
      {/* SIDEBAR CODE REMAINS EXACTLY THE SAME... */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card/30 backdrop-blur-xl p-4 md:p-6 flex flex-row md:flex-col gap-4 md:gap-8 z-20 shrink-0">
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-8 shrink-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-black uppercase tracking-widest group p-2 md:p-0 bg-muted/50 md:bg-transparent rounded-lg md:rounded-none"
            title="Back to Hub"
          >
            <ChevronLeft
              size={16}
              className="md:w-3.5 md:h-3.5 group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden md:inline">Back to Hub</span>
          </button>

          <div className="hidden md:block">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter mb-1 flex items-center gap-3 text-foreground">
              <SettingsIcon className="text-muted-foreground" size={24} />{" "}
              Settings
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              Configuration
            </p>
          </div>
        </div>

        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible custom-scrollbar flex-1 md:flex-none items-center md:items-stretch">
          {TABS.map((tab) => {
            const isActive = currentPath === tab.path;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                title={tab.label}
                className={`
                  flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0
                  ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_-5px_var(--color-primary)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  }
                `}
              >
                <tab.icon size={18} className="md:w-4 md:h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* --- CONTENT AREA REMAINS EXACTLY THE SAME --- */}
      <ScrollArea className="flex-1 h-full w-full relative bg-background">
        <div className="p-6 md:p-12 relative min-h-full">
          <div className="absolute top-0 right-0 w-75 md:w-125 h-75 md:h-125 bg-primary/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-2xl relative z-10 mx-auto md:mx-0 pb-10">
            <Outlet />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
