
import { useProjectStore } from "@/store/project-store";
import { 
    Search, LayoutGrid, List, ArrowLeft, ChevronRight, 
    Import, 
} from "lucide-react";
import PropertiesPanel from "../pages/project-creator/components/properties-panel";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    const { 
        currentPath, navigateUp, searchQuery, setSearchQuery, 
        viewMode, setViewMode, activeFileId 
    } = useProjectStore();

    return (
        <div className="h-full w-full flex flex-col bg-[#09090b] text-foreground">
            {/* --- TOP BAR --- */}
            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-md z-20 shrink-0 gap-4">
                
                {/* Left: Navigation & Breadcrumbs */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button 
                        onClick={navigateUp} 
                        disabled={currentPath.length <= 1}
                        className="p-1.5 hover:bg-muted rounded-md disabled:opacity-30 transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    
                    <div className="flex items-center gap-1 overflow-hidden mask-linear-fade">
                        {currentPath.map((item, i) => (
                            <div key={item.id} className="flex items-center gap-1 whitespace-nowrap">
                                {i > 0 && <ChevronRight size={12} className="opacity-30" />}
                                <button 
                                    className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${
                                        i === currentPath.length - 1 
                                            ? "bg-primary/10 text-primary" 
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {item.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Search */}
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search current folder..."
                        className="w-full bg-muted/50 border border-border/50 rounded-lg pl-9 pr-4 py-1.5 text-xs font-medium focus:border-primary outline-none transition-all"
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                        <Import size={14} /> <span className="hidden sm:inline">Import</span>
                    </button>
                    
                    <div className="h-6 w-px bg-border/50 mx-1" />
                    
                    <div className="flex bg-muted/50 p-0.5 rounded-lg border border-border/50">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <List size={14} />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- WORKSPACE SPLIT --- */}
            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 relative">
                    {children}
                </main>
                
                {/* Right Side: Properties Panel */}
                {activeFileId && (
                    <aside className="w-80 border-l border-border bg-card/30 backdrop-blur-xl z-10 flex flex-col">
                        <PropertiesPanel />
                    </aside>
                )}
            </div>
        </div>
    );
}
