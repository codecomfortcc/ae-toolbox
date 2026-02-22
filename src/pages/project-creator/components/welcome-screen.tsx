import { useState } from "react";
import { useProjectStore } from "@/store/project-store";
import { Plus, FolderOpen, Clock, Import, FileVideo } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { motion } from "framer-motion";

const TEMPLATES = [
    { id: 'blank', name: 'Blank Project', desc: 'Start from scratch' },
    { id: 'social', name: 'Social Media Pack', desc: 'Reels, TikTok structure' },
    { id: 'cinema', name: 'Cinematic Pipeline', desc: 'Proxies, VFX, Color' },
];

export default function WelcomeScreen() {
    const { recentProjects, createProject, openProject } = useProjectStore();
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [projName, setProjName] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("blank");

    return (
        <div className="h-full w-full bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">
            {/* Professional Noise Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-tr from-background via-background to-primary/5 pointer-events-none" />

            <div className="max-w-5xl w-full z-10 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12 p-8">
                
                {/* LEFT: Recent Projects */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-primary/10 rounded-xl"><FileVideo className="text-primary" size={32} /></div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase">AE-Toolbox</h1>
                            <p className="text-muted-foreground text-sm">Project Manager v2.0</p>
                        </div>
                    </div>
                    
                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Recent Projects</h2>
                    <div className="grid gap-3">
                        {recentProjects.map(proj => (
                            <motion.button
                                key={proj.id}
                                whileHover={{ scale: 1.01, x: 4 }}
                                onClick={() => openProject(proj)}
                                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all group text-left shadow-sm"
                            >
                                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-gray-800 to-black flex items-center justify-center shrink-0">
                                    <span className="text-lg font-bold text-gray-500 group-hover:text-primary">AE</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{proj.name}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                        <Clock size={10} /> {proj.lastOpened}
                                        <span className="opacity-50">•</span> {proj.path}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="space-y-4 pt-24">
                    <Button 
                        size="lg" 
                        onClick={() => setIsNewOpen(true)}
                        className="w-full h-14 text-base font-bold shadow-[0_0_30px_rgba(var(--primary),0.2)]"
                    >
                        <Plus className="mr-2" /> New Project
                    </Button>
                    
                    <Button variant="outline" size="lg" className="w-full h-12 bg-transparent border-white/10">
                        <FolderOpen className="mr-2" /> Open from Disk
                    </Button>
                </div>
            </div>

            {/* --- NEW PROJECT DIALOG (Shadcn) --- */}
            <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
                <DialogContent className="sm:max-w-150 bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase">Create Project</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Project Name</label>
                            <Input 
                                placeholder="My Awesome Edit" 
                                value={projName} 
                                onChange={e => setProjName(e.target.value)} 
                                autoFocus
                                className="h-11 bg-accent/20"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Select Template</label>
                            <div className="grid grid-cols-2 gap-3">
                                {TEMPLATES.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            selectedTemplate === t.id 
                                            ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary' 
                                            : 'bg-card border-border hover:bg-accent'
                                        }`}
                                    >
                                        <div className="font-bold text-sm">{t.name}</div>
                                        <div className="text-[10px] opacity-70 mt-1">{t.desc}</div>
                                    </div>
                                ))}
                                <div className="p-4 rounded-xl border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-accent/50 transition-colors">
                                    <Import size={16} />
                                    <span className="text-[10px] font-bold">Import Custom</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => createProject(projName || "Untitled", selectedTemplate)} className="w-full font-bold">
                            Initialize Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
