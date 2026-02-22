import { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutTemplate, Waypoints, Zap, Play, 
    Save, ChevronLeft, LayoutGrid, MousePointerSquareDashed,
    Type, SlidersHorizontal, ToggleLeft, MonitorPlay, Settings2
} from "lucide-react";

// --- REACT FLOW IMPORTS ---
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // CRITICAL: Core styles for the node engine

type EditorTab = "ui" | "function" | "advanced";

export default function BlueprintEditor() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Read the params passed from the Wizard
    const projectName = searchParams.get("name") || "Untitled_Plugin";
    const architecture = searchParams.get("arch") || "jsx";
    
    const [activeTab, setActiveTab] = useState<EditorTab>("function"); // Defaulting to function for testing

    return (
        <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden selection:bg-primary/30">
            
            {/* --- EDITOR HEADER --- */}
            <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
                <div className="flex items-center gap-4 md:gap-6">
                    <button 
                        onClick={() => navigate("/creator")}
                        className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                        title="Back to Wizard"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-border hidden md:block" />
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg shadow-sm">
                            <Waypoints size={18} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xs font-black uppercase tracking-widest leading-none mb-1">{projectName}</h1>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                Blueprint • {architecture.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center: Main Tab Navigation */}
                <div className="hidden md:flex bg-muted/40 p-1.5 rounded-xl border border-border/50">
                    <TabButton active={activeTab === "ui"} onClick={() => setActiveTab("ui")} icon={LayoutTemplate} label="UI Builder" />
                    <TabButton active={activeTab === "function"} onClick={() => setActiveTab("function")} icon={Waypoints} label="Node Engine" />
                    <TabButton active={activeTab === "advanced"} onClick={() => setActiveTab("advanced")} icon={Zap} label="Configuration" />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-xl border border-border transition-colors">
                        <Save size={14} /> <span className="hidden md:inline">Save</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 md:px-6 py-2 bg-primary hover:opacity-90 text-primary-foreground text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_-3px_var(--color-primary)] transition-all">
                        <Play size={14} className="fill-current" /> <span className="hidden md:inline">Build & Run</span>
                    </button>
                </div>
            </header>

            {/* --- EDITOR WORKSPACE --- */}
            <main className="flex-1 relative overflow-hidden bg-background">
                {/* Global Grid Background for non-ReactFlow tabs */}
                {activeTab !== "function" && (
                    <div 
                        className="absolute inset-0 opacity-20 pointer-events-none z-0" 
                        style={{ backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                    />
                )}

                {/* Tab Content Router */}
                <AnimatePresence mode="wait">
                    {activeTab === "ui" && <UIBuilderWorkspace key="ui" />}
                    {activeTab === "function" && <FunctionNodesWorkspace key="function" />}
                    {activeTab === "advanced" && <AdvancedWorkspace key="advanced" />}
                </AnimatePresence>
            </main>
        </div>
    );
}

// ==========================================
// --- 1. THE UI BUILDER ---
// ==========================================

function UIBuilderWorkspace() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 flex z-10"
        >
            {/* Left Sidebar: Components Palette */}
            <div className="w-64 border-r border-border bg-card/60 backdrop-blur-xl flex flex-col shadow-2xl">
                <div className="p-4 border-b border-border/50">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <LayoutTemplate size={14} className="text-primary" /> Components
                    </h2>
                </div>
                <div className="p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                    <DraggableItem icon={MousePointerSquareDashed} label="Button" />
                    <DraggableItem icon={Type} label="Text Label" />
                    <DraggableItem icon={SlidersHorizontal} label="Slider" />
                    <DraggableItem icon={ToggleLeft} label="Checkbox" />
                    <DraggableItem icon={MonitorPlay} label="Video Player" />
                </div>
            </div>

            {/* Center Canvas: The Grid Builder */}
            <div className="flex-1 p-8 flex items-center justify-center overflow-auto relative">
                <div className="max-w-md w-full text-center p-8 bg-card border border-border rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <LayoutGrid size={48} className="mx-auto text-primary mb-6" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-foreground">Initialize Canvas</h2>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-8 leading-relaxed">
                        Select a base grid structure. You can add more rows and resize columns later.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <GridPresetButton cols={1} />
                        <GridPresetButton cols={2} />
                        <GridPresetButton cols={3} />
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Properties Panel */}
            <div className="w-72 border-l border-border bg-card/60 backdrop-blur-xl flex flex-col shadow-2xl">
                <div className="p-4 border-b border-border/50">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Settings2 size={14} className="text-primary" /> Properties
                    </h2>
                </div>
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <p className="text-muted-foreground/50 text-xs font-bold uppercase tracking-widest leading-relaxed">
                        Select an element on the canvas to edit its properties
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

// ==========================================
// --- 2. THE FUNCTION ENGINE (NODE BUILDER) ---
// ==========================================

// CUSTOM NODE COMPONENT (Geometry Nodes Style)
function CustomBlueprintNode({ data }: { data: any }) {
    return (
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-w-[180px] group transition-all hover:border-primary/50">
            {/* Colored Header */}
            <div className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-between ${data.headerColor || 'bg-primary'}`}>
                {data.title}
            </div>
            
            {/* Node Body */}
            <div className="p-4 relative bg-background/80 backdrop-blur-md">
                
                {/* Input Port (Target) */}
                {data.hasInput && (
                    <Handle 
                        type="target" 
                        position={Position.Left} 
                        className="!w-3 !h-3 !bg-background !border-2 !border-primary !-ml-1.5 hover:!scale-125 hover:!bg-primary transition-all" 
                    />
                )}
                
                <div className="text-xs font-bold text-foreground text-center">
                    {data.label}
                </div>
                
                {/* Output Port (Source) */}
                {data.hasOutput && (
                    <Handle 
                        type="source" 
                        position={Position.Right} 
                        className="!w-3 !h-3 !bg-background !border-2 !border-primary !-mr-1.5 hover:!scale-125 hover:!bg-primary transition-all" 
                    />
                )}
            </div>
        </div>
    );
}

// Register our custom nodes OUTSIDE the component to prevent re-rendering issues
const nodeTypes = {
    blueprintNode: CustomBlueprintNode,
};

function FunctionNodesWorkspace() {
    // 1. Initial Nodes State
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: 'node-1',
            type: 'blueprintNode',
            position: { x: 100, y: 200 },
            data: { 
                title: 'Event', 
                label: 'On Button Click', 
                headerColor: 'bg-emerald-600',
                hasInput: false,
                hasOutput: true
            },
        },
        {
            id: 'node-2',
            type: 'blueprintNode',
            position: { x: 500, y: 200 },
            data: { 
                title: 'Action', 
                label: 'Trigger Alert', 
                headerColor: 'bg-blue-600',
                hasInput: true,
                hasOutput: false
            },
        }
    ]);

    // 2. Initial Edges State (The glowing wire)
    const [edges, setEdges] = useState<Edge[]>([
        { 
            id: 'edge-1-2', 
            source: 'node-1', 
            target: 'node-2', 
            animated: true, 
            style: { stroke: 'var(--color-primary)', strokeWidth: 2 } 
        }
    ]);

    // 3. Handlers for dragging and connecting
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    
    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge({ 
            ...connection, 
            animated: true, 
            style: { stroke: 'var(--color-primary)', strokeWidth: 2 } 
        }, eds)),
        []
    );

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10"
        >
            {/* The React Flow Canvas */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-[#09090b]" // Deep dark background for the node engine
            >
                {/* The Dot Grid Background natively provided by React Flow */}
                <Background 
                    color="var(--color-border)" 
                    gap={24} 
                    size={2} 
                />
                
                {/* Zoom & Pan Controls in the bottom left */}
                <Controls 
                    className="bg-card border-border fill-foreground shadow-2xl rounded-xl overflow-hidden"
                    showInteractive={false} 
                />
            </ReactFlow>

            {/* Overlay UI (Hotkeys) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 md:gap-6 z-50 pointer-events-none">
                <ShortcutHint keys={["SHIFT", "A"]} desc="Add Node" />
                <ShortcutHint keys={["CTRL", "SPACE"]} desc="Search Engine" />
            </div>
        </motion.div>
    );
}

// ==========================================
// --- 3. THE CONFIGURATION / FUTURE TAB ---
// ==========================================

function AdvancedWorkspace() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center z-10"
        >
            <div className="text-center max-w-sm">
                <Zap size={48} className="mx-auto text-muted-foreground/30 mb-6" />
                <h2 className="text-xl font-black uppercase tracking-tight text-muted-foreground mb-2">Build Configuration</h2>
                <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest leading-relaxed">
                    Packaging settings, app icons, and manifest configuration will live here.
                </p>
            </div>
        </motion.div>
    )
}

// ==========================================
// --- REUSABLE SMALL HELPERS ---
// ==========================================

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${active ? 'bg-card text-foreground shadow-md border border-border/80' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'}
            `}
        >
            <Icon size={14} className={active ? "text-primary" : ""} /> {label}
        </button>
    )
}

function DraggableItem({ icon: Icon, label }: any) {
    return (
        <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl text-xs font-bold cursor-grab hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
            <div className="p-1.5 bg-muted rounded-md group-hover:bg-primary/10 transition-colors">
                <Icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-foreground">{label}</span>
        </div>
    )
}

function GridPresetButton({ cols }: { cols: number }) {
    return (
        <button className="w-20 h-20 border-2 border-border hover:border-primary rounded-2xl flex items-center justify-center gap-1.5 bg-background hover:bg-primary/5 transition-all hover:scale-105 hover:shadow-lg group">
            {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="w-3 h-10 bg-muted-foreground/30 rounded-full group-hover:bg-primary/50 transition-colors" />
            ))}
        </button>
    )
}

function ShortcutHint({ keys, desc }: { keys: string[], desc: string }) {
    return (
        <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md border border-border p-3 rounded-2xl shadow-xl pointer-events-auto">
            <div className="flex gap-1">
                {keys.map((k, i) => (
                    <div key={i} className="px-2.5 py-1.5 bg-background border border-border/80 rounded-lg text-[10px] font-black text-foreground shadow-sm">
                        {k}
                    </div>
                ))}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground pr-2 hidden md:inline">{desc}</span>
        </div>
    )
}
