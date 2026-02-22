import { memo, useRef, useState, useMemo } from 'react';
import { FileNode } from '@/store/project-store';
import { 
    FileAudio, Play, Settings2, Folder
} from 'lucide-react';
import * as MdIcons from "react-icons/md"; // npm install react-icons
import { cn } from "@/lib/utils";

interface ProjectGridItemProps {
    file: FileNode;
    selected: boolean;
    onSelect: () => void;
    onNavigate: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

const ProjectGridItem = memo(function ProjectGridItem({ 
    file, selected, onSelect, onNavigate, onContextMenu 
}: ProjectGridItemProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // --- DYNAMIC ICON RESOLVER ---
    const CustomIcon = useMemo(() => {
        // @ts-ignore - Dynamic access to React Icons
        if (file.icon && MdIcons[file.icon]) return MdIcons[file.icon];
        return null;
    }, [file.icon]);

    // --- 60FPS SCRUBBING ENGINE ---
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isHovering) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const decimal = Math.max(0, Math.min(1, x / rect.width));

        // A. Video Seeking
        if (file.type === 'video' && videoRef.current) {
            const duration = videoRef.current.duration || 10;
            // Only update if time changed > 0.1s to prevent CPU thrashing
            if (Math.abs(videoRef.current.currentTime - (duration * decimal)) > 0.1) {
                videoRef.current.currentTime = duration * decimal;
            }
        }

        // B. Visual Updates (Direct DOM manipulation)
        if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${decimal})`;
        }
        if (badgeRef.current) {
            if (file.type === 'video') {
                const totalSeconds = (videoRef.current?.duration || 10) * decimal;
                // Format MM:SS
                const min = Math.floor(totalSeconds / 60);
                const sec = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
                badgeRef.current.textContent = `${min}:${sec}`;
            } else if (file.type === 'audio') {
                badgeRef.current.textContent = `${(decimal * 100).toFixed(0)}%`;
            }
        }
    };

    return (
        <div 
            className={cn(
                "group relative w-full h-full rounded-xl border transition-all duration-200 overflow-hidden select-none bg-card/40 backdrop-blur-sm",
                selected 
                    ? "border-primary ring-2 ring-primary/50 shadow-2xl scale-[1.02] z-10" 
                    : "border-white/5 hover:border-white/20 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg"
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onContextMenu={onContextMenu}
        >
            {/* --- 1. CLICK CATCHER --- */}
            {/* This transparent layer ensures clicks work 100% of the time,
                preventing video/image elements from stealing events. */}
            <div 
                className="absolute inset-0 z-10 bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    onNavigate();
                }}
            />

            {/* --- 2. MEDIA PREVIEW LAYER --- */}
            <div className="absolute inset-0 bottom-10 bg-black/20 flex items-center justify-center overflow-hidden">
                
                {/* VIDEO */}
                {file.type === 'video' && (
                    <>
                        <video 
                            ref={videoRef} 
                            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                            muted 
                            loop={false} 
                        />
                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-md border border-white/10">
                                <Play size={16} fill="white" className="text-white ml-0.5" />
                            </div>
                        </div>
                    </>
                )}
                
                {/* FOLDER */}
                {file.type === 'folder' && (
                    <div className="relative text-center transition-transform duration-300 group-hover:scale-110">
                         {file.color && (
                             <div 
                                className="absolute inset-0 blur-3xl opacity-30 transition-opacity" 
                                style={{ backgroundColor: file.color }} 
                             />
                         )}
                         
                         <div className="relative z-0">
                             {CustomIcon ? (
                                 <CustomIcon size={64} style={{ color: file.color || '#64748b' }} />
                             ) : (
                                 <Folder 
                                    size={64} 
                                    className={!file.color ? "text-muted-foreground" : ""}
                                    fill={file.color || "currentColor"} 
                                    style={{ color: file.color }} 
                                    strokeWidth={0.5}
                                 />
                             )}
                         </div>
                         
                         {/* Item Count Badge (Mock) */}
                         <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-2 py-0.5 rounded-full text-[9px] font-mono text-white/70 opacity-0 group-hover:opacity-100 transition-all">
                            4 items
                         </div>
                    </div>
                )}
                
                {/* IMAGE */}
                {file.type === 'image' && (
                    <div className="w-full h-full bg-black">
                        <img 
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400" 
                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                            alt={file.name}
                        />
                    </div>
                )}
                
                {/* AUDIO */}
                {file.type === 'audio' && (
                    <div className="flex flex-col items-center gap-2">
                        <FileAudio size={48} className="text-emerald-500/80" />
                        {isHovering && (
                             <div className="flex gap-1 h-4 items-end">
                                {[...Array(6)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="w-1 bg-emerald-500 rounded-full animate-pulse"
                                        style={{ 
                                            height: `${Math.random() * 100}%`,
                                            animationDuration: `${0.2 + Math.random() * 0.3}s` 
                                        }} 
                                    />
                                ))}
                             </div>
                        )}
                    </div>
                )}
            </div>

            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <button 
                    onClick={(e) => { e.stopPropagation(); onContextMenu(e); }}
                    className="p-1.5 bg-black/60 hover:bg-primary text-white rounded-lg backdrop-blur-md transition-colors pointer-events-auto"
                >
                    <Settings2 size={12} />
                </button>
            </div>

            {/* Scrubber Bar (Video/Audio only) */}
            {(file.type === 'video' || file.type === 'audio') && (
                <>
                    <div ref={progressRef} className="absolute bottom-10 left-0 h-0.5 bg-primary z-20 origin-left scale-x-0 will-change-transform" />
                    <div ref={badgeRef} className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        00:00
                    </div>
                </>
            )}

            {/* --- 4. FOOTER INFO --- */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-card/90 border-t border-white/5 flex items-center px-3 backdrop-blur-md">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                         <p className={cn(
                             "text-xs font-bold truncate transition-colors",
                             selected ? "text-primary" : "text-foreground/90"
                         )}>
                            {file.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-muted-foreground font-mono uppercase truncate">
                            {file.size || '0KB'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProjectGridItem;
