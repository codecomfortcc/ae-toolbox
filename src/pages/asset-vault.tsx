import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Download, Trash2,  X, ChevronLeft, 
  Layers, Zap, FileVideo, Package,
 Cloud, CheckCircle2, Play
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* --- TYPES --- */
type AssetType = "plugin" | "ffx" | "project";

interface Asset {
  id: string;
  title: string;
  author: string;
  type: AssetType;
  description: string;
  images: string[];
  downloads: string;
  size: string;
  version: string;
  tags: string[];
}

/* --- MOCK DATA --- */
const MOCK_ASSETS: Asset[] = [
  {
    id: "1",
    title: "Glitch Master Pro",
    author: "MotionLabs",
    type: "plugin",
    description: "The ultimate glitch effect generator for After Effects. Create cyber-punk aesthetics in seconds with over 50 presets and full control over chromatic aberration, pixel sorting, and data corruption effects.",
    images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600"],
    downloads: "12.5k",
    size: "45 MB",
    version: "2.1.0",
    tags: ["VFX", "Glitch", "Distortion"]
  },
  {
    id: "2",
    title: "Cinematic Title Pack",
    author: "CreativeFlow",
    type: "project",
    description: "A collection of 20 high-quality, 4K ready cinematic titles. Fully editable text layers, color controls, and auto-resizing boxes. Perfect for trailers and openers.",
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600", "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600"],
    downloads: "8.2k",
    size: "120 MB",
    version: "1.0",
    tags: ["Titles", "4K", "Cinematic"]
  },
  {
    id: "3",
    title: "Smooth Transitions",
    author: "VFX Daily",
    type: "ffx",
    description: "Drag and drop smooth zoom, slide, and whip transitions. GPU accelerated and motion blur enabled by default.",
    images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600"],
    downloads: "45k",
    size: "2 MB",
    version: "3.5",
    tags: ["Transition", "Preset", "Workflow"]
  },
  {
    id: "4",
    title: "Neon Glow Kit",
    author: "CyberSpace",
    type: "project",
    description: "Complete toolkit for creating realistic neon signs. Includes flickering effects, buzzing audio, and realistic wall reflections.",
    images: ["https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600"],
    downloads: "3.1k",
    size: "350 MB",
    version: "1.2",
    tags: ["Neon", "3D", "Glow"]
  },
  {
    id: "5",
    title: "Data Mosher",
    author: "PixelCrusher",
    type: "plugin",
    description: "Real-time datamoshing inside After Effects. Break your video compression intentionally for artistic effect.",
    images: ["https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=600"],
    downloads: "900",
    size: "12 MB",
    version: "0.9.5",
    tags: ["Datamosh", "Pixel", "Art"]
  }
];

export default function AssetVault() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<AssetType | "all">("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [installedAssets, setInstalledAssets] = useState<string[]>([]); // Mock state for installed IDs

  // Filter Logic
  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === "all" || asset.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Action Handlers
  const handleInstall = (id: string) => {
    // In real app: invoke('install_asset', { id })
    setInstalledAssets([...installedAssets, id]);
  };

  const handleUninstall = (id: string) => {
    setInstalledAssets(installedAssets.filter(item => item !== id));
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden select-none">
      
      {/* --- TOP NAV --- */}
      <div className="flex justify-between items-center p-6 border-b border-border/40 bg-background/50 backdrop-blur-md z-10 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground gap-2 hover:bg-muted/50"
        >
          <ChevronLeft size={14} /> Dashboard
        </Button>

        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.1)]">
          <Cloud className="text-primary" size={12} />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">
            Asset Vault Cloud
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-8 overflow-hidden max-w-400 mx-auto w-full">
        
        {/* --- HEADER & SEARCH --- */}
        <header className="flex justify-between items-end mb-8 shrink-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground">
              Asset <span className="text-primary selection:bg-primary/30">Vault</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.25em] mt-2 ml-1 opacity-70">
              Community Powered Repository
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3 w-full max-w-md">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
              <Input 
                placeholder="SEARCH PLUGINS, PROJECTS, PRESETS..." 
                className="pl-10 h-10 bg-card/50 border-border rounded-xl text-xs font-bold tracking-wide uppercase focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-2">
              {[
                { id: "all", label: "All Assets", icon: Layers },
                { id: "plugin", label: "Plugins", icon: Zap },
                { id: "project", label: "Projects", icon: FileVideo },
                { id: "ffx", label: "Presets", icon: Package },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all",
                    filter === f.id 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-card/50 border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <f.icon size={12} /> {f.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* --- ASSET GRID --- */}
        <ScrollArea className="overflow-y-auto  pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredAssets.map((asset) => (
              <motion.div
                layoutId={`card-${asset.id}`}
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="group relative bg-card border border-border/50 rounded-3xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={asset.images[0]} 
                    alt={asset.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-[9px] font-black uppercase border-border/50">
                      {asset.type}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-lg leading-none uppercase italic">{asset.title}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground mt-1">by {asset.author}</p>
                    </div>
                    {installedAssets.includes(asset.id) && (
                      <CheckCircle2 className="text-primary" size={18} />
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {asset.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded bg-accent/50 text-muted-foreground border border-border/30">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase">
                    <span className="flex items-center gap-1"><Download size={12} /> {asset.downloads}</span>
                    <span>{asset.size}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

      </div>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            />
            
            <motion.div 
              layoutId={`card-${selectedAsset.id}`}
              className="w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row z-50"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white rounded-full"
                onClick={() => setSelectedAsset(null)}
              >
                <X size={20} />
              </Button>

              {/* Left: Image Showcase */}
              <div className="md:w-1/2 bg-black relative flex flex-col">
                 <div className="flex-1 relative overflow-hidden">
                    <img 
                      src={selectedAsset.images[0]} 
                      className="absolute inset-0 w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card to-transparent md:bg-linear-to-r" />
                 </div>
                 {/* Mini Gallery (Mock) */}
                 <div className="h-20 bg-background/10 backdrop-blur-md flex gap-2 p-2 absolute bottom-0 left-0 right-0">
                    {selectedAsset.images.map((img, i) => (
                      <div key={i} className="aspect-video h-full rounded-lg overflow-hidden border border-white/20 cursor-pointer hover:border-primary">
                        <img src={img} className="w-full h-full object-cover" />
                      </div>
                    ))}
                 </div>
              </div>

              {/* Right: Info & Actions */}
              <div className="md:w-1/2 p-8 flex flex-col bg-card">
                 <div className="flex items-start justify-between mb-6">
                    <div>
                      <Badge variant="outline" className="mb-2 border-primary/30 text-primary bg-primary/5">{selectedAsset.type}</Badge>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">{selectedAsset.title}</h2>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-bold uppercase">
                        <span>v{selectedAsset.version}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{selectedAsset.author}</span>
                      </div>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto pr-2 ">
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {selectedAsset.description}
                    </p>
                    
                    <div className="mt-6 space-y-3">
                       <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tags</h4>
                       <div className="flex flex-wrap gap-2">
                          {selectedAsset.tags.map(t => (
                            <Badge key={t} variant="secondary" className="bg-accent/50 text-foreground border border-border/50">#{t}</Badge>
                          ))}
                       </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-accent/20 border border-border/50 flex justify-between items-center text-xs font-mono">
                       <div className="text-muted-foreground">Compatibility</div>
                       <div className="font-bold text-foreground">AE 2022+</div>
                    </div>
                 </div>

                 {/* Action Bar */}
                 <div className="mt-8 pt-6 border-t border-border/50 flex gap-3">
                    {installedAssets.includes(selectedAsset.id) ? (
                      <>
                        {selectedAsset.type === 'project' && (
                           <Button className="flex-1 h-12 text-xs font-black uppercase gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                              <Play size={16} /> Open Project
                           </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          className="flex-1 h-12 text-xs font-black uppercase gap-2"
                          onClick={() => handleUninstall(selectedAsset.id)}
                        >
                           <Trash2 size={16} /> Uninstall
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="flex-1 h-12 text-xs font-black uppercase gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                        onClick={() => handleInstall(selectedAsset.id)}
                      >
                         {selectedAsset.type === 'project' ? <Download size={16} /> : <Zap size={16} />}
                         {selectedAsset.type === 'project' ? "Download & Open" : "Install to AE"}
                      </Button>
                    )}
                 </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
