import { useState, useEffect } from "react";
import { useProjectStore } from "@/store/project-store";
import {
  X,
  FileBox,
  Palette,
  Smile,
  Plus,
  Search,
  MonitorPlay,
  Zap,
  Hash,
} from "lucide-react";
import * as MdIcons from "react-icons/md";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Default Swatches
const DEFAULT_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#71717a",
];

export default function PropertiesPanel() {
  const {
    activeFileId,
    setActiveFile,
    files,
    currentPath,
    setFolderColor,
    setFolderIcon,
  } = useProjectStore();

  const parentId = currentPath[currentPath.length - 1].id;
  const file = files[parentId]?.find((f) => f.id === activeFileId);

  // Local State
  const [iconSearch, setIconSearch] = useState("");
  const [savedColors, setSavedColors] = useState<string[]>(DEFAULT_COLORS);
  const [tempColor, setTempColor] = useState(""); // Current picker value

  // Sync temp color when file changes
  useEffect(() => {
    if (file?.color) setTempColor(file.color);
  }, [file?.id, file?.color]);

  if (!file) return null;

  // Filter Icons
  const filteredIcons = Object.keys(MdIcons)
    .filter((name) => name.toLowerCase().includes(iconSearch.toLowerCase()))
    .slice(0, 40);



  const handleSaveColor = () => {
    if (!savedColors.includes(tempColor)) {
      setSavedColors([...savedColors, tempColor]);
    }
    setFolderColor(file.id, tempColor);
  };

  return (
    <div className="flex flex-col min-h-full bg-card/95 backdrop-blur-xl border-l border-border/50 ">
      {/* --- HEADER --- */}
      <div className="h-14 px-4 border-b border-border/50 flex items-center justify-between shrink-0 bg-accent/5">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <FileBox size={12} />{" "}
          {file.type === "folder" ? "Folder Settings" : "Asset Properties"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setActiveFile(null)}
        >
          <X size={14} />
        </Button>
      </div>

      {/* --- MAIN PREVIEW --- */}
   
      {/* --- TABS --- */}

      <Tabs defaultValue="properties" className="flex-1 flex flex-col min-h-0">
        <div className="px-4 mt-2">
          <TabsList className="w-full grid grid-cols-2 bg-accent/20">
            <TabsTrigger value="properties" className="text-xs">
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="customize"
              className="text-xs"
              disabled={file.type !== "folder"}
            >
              Customize
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 space-y-6 overflow-hidden">
          {/* ==========================
                            TAB: PROPERTIES
                            ========================== */}
          <ScrollArea className="flex-1 overflow-y-auto w-full">
            <TabsContent
              value="properties"
              className="space-y-6 m-0 outline-none"
            >
              {/* FOLDER STATS */}
              {file.type === "folder" && (
                <Card className="p-3 bg-accent/10 border-border/50 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-muted-foreground">
                      Contains
                    </Label>
                    <div className="text-sm font-mono font-bold">12 Items</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-muted-foreground">
                      Total Size
                    </Label>
                    <div className="text-sm font-mono font-bold">1.2 GB</div>
                  </div>
                </Card>
              )}

              {/* AUTOMATION RULES (Folder Only) */}
              {file.type === "folder" && (
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Zap size={12} className="text-yellow-500" /> Automation
                    Rules
                  </Label>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-accent/20 transition-colors">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold">Instinct Sorting</div>
                      <div className="text-[10px] text-muted-foreground">
                        Auto-route files here
                      </div>
                    </div>
                    <Switch id="instinct" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-accent/20 transition-colors">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold">Power Rename</div>
                      <div className="text-[10px] text-muted-foreground">
                        Enforce naming convention
                      </div>
                    </div>
                    <Switch id="rename" />
                  </div>
                </div>
              )}

              {/* METADATA (Common) */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Hash size={12} /> Metadata
                </Label>
                <div className="grid grid-cols-2 gap-y-3 text-xs bg-accent/5 p-3 rounded-lg border border-border/30">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-mono text-right">
                    {file.dateModified || "Just now"}
                  </span>

                  {file.fps && (
                    <>
                      <span className="text-muted-foreground">Frame Rate</span>
                      <span className="font-mono text-right text-primary">
                        {file.fps} FPS
                      </span>
                    </>
                  )}
                  {file.resolution && (
                    <>
                      <span className="text-muted-foreground">Resolution</span>
                      <span className="font-mono text-right">
                        {file.resolution}
                      </span>
                    </>
                  )}
                  {file.duration && (
                    <>
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-mono text-right">
                        {file.duration}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* ACTIONS (File Only) */}
              {file.type !== "folder" && (
                <Button className="w-full font-bold bg-primary/10 text-primary hover:bg-primary/20">
                  <MonitorPlay className="mr-2 h-4 w-4" /> Open in After Effects
                </Button>
              )}
            </TabsContent>
          </ScrollArea>
          {/* ==========================
                            TAB: CUSTOMIZE (Folders)
                           ========================== */}
          <TabsContent value="customize" className="space-y-6 m-0 outline-none overflow-y-hidden">
            {/* COLOR PICKER */}
            <div className="space-y-3 ">
              <ScrollArea className="overflow-y-auto w-full h-full">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Palette size={12} /> Folder Color
                </Label>

                <div className="flex gap-4">
                  {/* Picker */}
                  <div className="shrink-0">
                    <HexColorPicker
                      color={tempColor}
                      onChange={(c) => {
                        setTempColor(c);
                        setFolderColor(file.id, c);
                      }}
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>

                  {/* Swatches & Save */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-1.5 content-start">
                      {savedColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setTempColor(c);
                            setFolderColor(file.id, c);
                          }}
                          className={cn(
                            "w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-110",
                            tempColor === c && "ring-2 ring-white scale-110",
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full text-[10px] h-7 font-bold gap-1 mt-2"
                      onClick={handleSaveColor}
                    >
                      <Plus size={10} /> Save Swatch
                    </Button>
                  </div>
                </div>

                <Separator className="bg-border/50 my-4" />

                {/* ICON PICKER */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Smile size={12} /> Custom Icon
                  </Label>
                  <div className="relative">
                    <Search
                      className="absolute left-2.5 top-2.5 text-muted-foreground"
                      size={12}
                    />
                    <Input
                      className="h-8 pl-8 text-xs bg-accent/30 border-border/50"
                      placeholder="Search icons (e.g. star, video)..."
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                    />
                  </div>
                  <Card className="grid grid-cols-5 gap-1 p-2 bg-accent/10 border-border/50 max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredIcons.map((iconName) => {
                      const IconComp = (MdIcons as any)[iconName];
                      return (
                        <button
                          key={iconName}
                          onClick={() => setFolderIcon(file.id, iconName)}
                          className={cn(
                            "aspect-square flex items-center justify-center rounded-md hover:bg-primary/20 hover:text-primary transition-colors text-lg",
                            file.icon === iconName
                              ? "bg-primary/20 text-primary"
                              : "text-muted-foreground",
                          )}
                          title={iconName}
                        >
                          <IconComp />
                        </button>
                      );
                    })}
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
