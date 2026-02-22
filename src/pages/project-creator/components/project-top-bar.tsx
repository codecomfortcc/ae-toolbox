import { useProjectStore } from "@/store/project-store";
import {
  Search,
  LayoutGrid,
  List,
  ArrowLeft,
  ChevronRight,
  Settings2,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectTopBar() {
  const {
    currentPath,
    navigateUp,
    viewMode,
    setViewMode,
    visibleColumns,
    setColumnVisibility,
    platform,
    setPowerLookPath,
    setSearchQuery,
    powerLookPath
  } = useProjectStore();

  const platformPlaceholders: Record<string, string> = {
    windows: "C:\\Users\\Username\\Documents",
    mac: "/Users/username/Documents",
    linux: "/home/username/Documents",
  };

  const placeholder =
    platformPlaceholders[platform] ?? "Enter folder path...";

  const quickFolders = ["Desktop", "Documents", "Downloads"];

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/80 backdrop-blur-md z-20 shrink-0">

      {/* LEFT — Back + Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0 flex-1">

        <Button
          variant="ghost"
          size="icon"
          onClick={navigateUp}
          disabled={currentPath.length <= 1}
          className="h-8 w-8 rounded-lg"
        >
          <ArrowLeft size={16} />
        </Button>

        <div className="flex items-center gap-1 overflow-hidden min-w-0">
          {currentPath.map((item, i) => {
            const isLast = i === currentPath.length - 1;

            return (
              <div key={item.id} className="flex items-center gap-1 shrink-0">
                {i > 0 && (
                  <ChevronRight size={12} className="opacity-40" />
                )}

                <button
                  className={`text-xs px-2 py-1 rounded-md transition-all ${
                    isLast
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  {item.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT — Utilities */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Small Search */}
        <div className="relative w-44">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search"
            className="h-8 pl-8 pr-2 text-xs bg-accent/40 border-border/50 rounded-md focus-visible:ring-1 focus-visible:ring-primary/40"
            onChange={(e) =>
          setSearchQuery(e.target.value)
            }
          />
        </div>

        {/* Import Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1.5">
              <FolderPlus size={14} />
              <span className="hidden sm:inline">Import</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md rounded-xl border border-border/60 bg-card shadow-2xl">

            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Import Files
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-2">

              {/* Platform Info */}
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-accent/40 border border-border/50">
                <span className="text-sm font-medium capitalize">
                  Platform: {platform}
                </span>
              </div>

              {/* Path Section */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Powerlook
                </p>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder={placeholder}
                    value={powerLookPath}
                    className="h-9 text-sm font-mono bg-accent/40 border-border/50 rounded-md focus-visible:ring-1 focus-visible:ring-primary/40"
                    onChange={(e) => setPowerLookPath(e.target.value)}
                  />
                  <Button size="sm" className="h-9" variant="outline">
                    Browse
                  </Button>
                </div>

                {/* Quick Access */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickFolders.map((folder) => (
                    <button
                      key={folder}
                      className="px-3 py-1.5 text-xs rounded-md bg-accent/40 hover:bg-accent/60 transition-all"
                      onClick={() => setPowerLookPath(folder)}
                    >
                      {folder}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="h-px bg-border/50" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>
              <DialogTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Drag and Drop Files</DialogTitle>
              {/* Drag & Drop */}
              <div className="group border-2 border-dashed border-border rounded-lg p-6 text-center transition-all hover:border-primary/50 hover:bg-accent/30 cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <FolderPlus
                    size={22}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <p className="text-sm font-medium">
                    Drag & Drop Files Here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse from your device
                  </p>
                </div>
              </div>

            </div>
          </DialogContent>
        </Dialog>

        {/* View Settings */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2.5">
              <Settings2 size={14} />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-72 p-4 rounded-xl border border-border/60 bg-card shadow-xl"
            align="end"
          >
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Visible Columns
              </h4>

              {Object.keys(visibleColumns).map((col) => (
                <div
                  key={col}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent/40 transition-all"
                >
                  <Label htmlFor={col} className="text-sm">
                    {visibleColumns[col].name}
                  </Label>

                  <Switch
                    id={col}
                    checked={visibleColumns[col].visible}
                    onCheckedChange={(c) =>
                      setColumnVisibility(col, c)
                    }
                  />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* View Toggle */}
        <div className="flex bg-accent/40 p-0.5 rounded-md border border-border/50">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-sm transition-all ${
              viewMode === "grid"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid size={14} />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-sm transition-all ${
              viewMode === "list"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List size={14} />
          </button>
        </div>

      </div>
    </header>
  );
}
