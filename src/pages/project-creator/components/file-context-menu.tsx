import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
    Trash2, Edit3, Palette, 
    Share2, ExternalLink, Copy 
} from "lucide-react";

interface ContextMenuProps {
    x: number;
    y: number;
    fileType: string;
    onClose: () => void;
    onColorPick: (color: string) => void;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'];

export default function FileContextMenu({ x, y, fileType, onClose, onColorPick }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    // Prevent menu from going off-screen
    const adjustedX = Math.min(x, window.innerWidth - 250);
    const adjustedY = Math.min(y, window.innerHeight - 300);

    return (
        <motion.div 
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-100 w-56 bg-card border border-border rounded-xl shadow-2xl p-1.5 flex flex-col gap-1"
            style={{ top: adjustedY, left: adjustedX }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <MenuItem icon={ExternalLink} label="Open" shortcut="Enter" />
            <MenuItem icon={Share2} label="Reveal in Explorer" />
            
            <div className="h-px bg-border my-1" />

            {/* FOLDER COLOR PICKER */}
            {fileType === 'folder' && (
                <div className="p-2">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <Palette size={12} className="text-muted-foreground" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Folder Color</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap px-1">
                        {COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => { onColorPick(c); onClose(); }}
                                className="w-5 h-5 rounded-full border border-border/50 hover:scale-110 transition-transform shadow-sm"
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {fileType === 'folder' && <div className="h-px bg-border my-1" />}

            <MenuItem icon={Edit3} label="Rename" shortcut="F2" />
            <MenuItem icon={Copy} label="Copy Path" />
            
            <div className="h-px bg-border my-1" />
            
            <MenuItem icon={Trash2} label="Delete" shortcut="Del" isDestructive />
        </motion.div>
    );
}

function MenuItem({ icon: Icon, label, shortcut, isDestructive }: any) {
    return (
        <button className={`
            flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold transition-colors
            ${isDestructive ? 'text-destructive hover:bg-destructive/10' : 'text-foreground hover:bg-muted'}
        `}>
            <div className="flex items-center gap-2">
                <Icon size={14} />
                <span>{label}</span>
            </div>
            {shortcut && <span className="text-[9px] opacity-50 font-mono">{shortcut}</span>}
        </button>
    );
}
