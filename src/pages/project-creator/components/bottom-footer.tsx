import { useProjectStore } from "@/store/project-store";
import { Zap, MonitorPlay} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectFooter() {
    const { activeFileId, files, currentPath } = useProjectStore();
    const parentId = currentPath[currentPath.length - 1].id;
    const file = files[parentId]?.find(f => f.id === activeFileId);

    return (
        <footer className="h-9 bg-card border-t border-border flex items-center justify-between px-4 text-[10px] shrink-0 select-none z-20">
            <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-primary">
                    <Zap size={10} />
                    <span className="font-bold uppercase tracking-wider">Power Look: Ready</span>
                </div>
                {file && (
                    <>
                        <div className="h-3 w-px bg-border" />
                        <span className="text-foreground font-bold">{file.name}</span>
                        <span>{file.size || '0KB'}</span>
                        {file.fps && <span>{file.fps} FPS</span>}
                    </>
                )}
            </div>
            <div className="flex items-center gap-2">
                {file && file.type !== 'folder' && (
                    <Button size="sm" variant="ghost" className="h-6 text-[10px] uppercase font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                        <MonitorPlay size={10} className="mr-1.5" /> Open in AE
                    </Button>
                )}
            </div>
        </footer>
    );
}
