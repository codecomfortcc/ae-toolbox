import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, Copy, AppWindow } from "lucide-react";
import { cn } from "@/lib/utils";
import icon from "@/assets/icon.png";
const appWindow = getCurrentWindow();

export default function CustomTitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // Sync state with Tauri window events
  useEffect(() => {
    const updateState = async () => {
      setIsMaximized(await appWindow.isMaximized());
    };

    updateState();

    // Listen for resize/focus events to update UI
    const unlistenResize = appWindow.onResized(updateState);
    const unlistenFocus = appWindow.onFocusChanged(({ payload: focused }) =>
      setIsFocused(focused),
    );

    return () => {
      unlistenResize.then((f) => f());
      unlistenFocus.then((f) => f());
    };
  }, []);

  return (
    <div
      data-tauri-drag-region
      className={cn(
        "h-9 flex items-center justify-between select-none z-[9999] fixed top-0 left-0 right-0 transition-colors duration-200",
        // Visual Style: Glassmorphism background that blends with the app
        isFocused
          ? "bg-background/80 backdrop-blur-md border-b border-border/40"
          : "bg-background/40 backdrop-blur-sm border-b border-white/5 opacity-80",
      )}
    >
      <div className="flex items-center px-4 gap-2 pointer-events-none">
        <div
          className={cn(
            "w-4 h-4 rounded flex items-center justify-center transition-colors",
            isFocused
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          <img src={icon} alt="Logo" className="w-4 h-4" />
        </div>

        <span
          className={cn(
            "text-[11px] font-medium tracking-wide transition-opacity",
            isFocused ? "opacity-100" : "opacity-40",
          )}
        >
          AE Toolbox (Nightly)
        </span>
      </div>

      {/* --- RIGHT: WINDOW CONTROLS --- */}
      <div className="flex h-full items-center">
        <TitleBarButton onClick={() => appWindow.minimize()}>
          <Minus size={14} strokeWidth={2} />
        </TitleBarButton>

        <TitleBarButton onClick={() => appWindow.toggleMaximize()}>
          {/* Toggle icon based on state */}
          {isMaximized ? (
            <Copy size={12} className="rotate-180" strokeWidth={2.5} />
          ) : (
            <Square size={12} strokeWidth={2.5} />
          )}
        </TitleBarButton>

        <TitleBarButton onClick={() => appWindow.close()} isDestructive>
          <X size={14} strokeWidth={2} />
        </TitleBarButton>
      </div>
    </div>
  );
}

// Helper Component for Buttons
function TitleBarButton({ children, onClick, isDestructive }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-full w-10 flex items-center justify-center transition-all duration-200 outline-none",
        isDestructive
          ? "hover:bg-red-500 hover:text-white active:bg-red-600 text-muted-foreground"
          : "hover:bg-muted active:bg-accent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
