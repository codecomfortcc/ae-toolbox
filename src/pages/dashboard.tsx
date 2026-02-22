import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cpu,
  Search,
  Bell,
  Command,
  Database,
  ChevronRight,
  Terminal as TerminalIcon,
  HardDrive,
  Activity,
} from "lucide-react";

import { TOOLS } from "@/config/tools";
import { useAppStore } from "../store/use-appstore";
import { ScrollArea } from "../components/ui/scroll-area";

export default function Dashboard() {
  const navigate = useNavigate();
  const { targetAE } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on search
  const filteredTools = TOOLS.filter(
    (t: any) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    // We use h-full instead of min-h-screen because AppLayout already handles the screen height
    <div className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden relative">
      {/* --- HEADER --- */}
      <header className="h-20 border-b border-border flex items-center justify-between px-6 md:px-8 bg-background/80 backdrop-blur-md z-20 shrink-0">
        {/* Breadcrumb / Title */}
        <div className="flex flex-col hidden sm:flex">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            Workspace
          </span>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-foreground">
            Dashboard
          </h1>
        </div>

        {/* Command Bar (Search) */}
        <div className="flex-1 max-w-md mx-4 sm:mx-8 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="SEARCH TOOLS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/30 border border-border rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 focus:bg-card transition-all uppercase tracking-wide"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-1 rounded bg-muted border border-border">
            <Command size={10} className="text-muted-foreground" />
            <span className="text-[9px] font-black text-muted-foreground">
              K
            </span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
              Active Engine
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-foreground uppercase">
                {targetAE ? `After Effects ${targetAE}` : "Detecting..."}
              </span>
            </div>
          </div>
          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-background" />
          </button>
        </div>
      </header>

      {/* --- SCROLLABLE MAIN CONTENT --- */}
      <ScrollArea className="flex-1 w-full h-full relative z-10">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 inset-x-0 h-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="p-6 pb-24 max-w-7xl mx-auto space-y-12">
          {/* A. QUICK STATS ROW */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Plugins"
                value="124"
                icon={Database}
                index={0}
              />
              <StatCard
                label="Scripts Run"
                value="892"
                icon={TerminalIcon}
                index={1}
              />
              <StatCard
                label="Disk Usage"
                value="2.4 GB"
                icon={HardDrive}
                index={2}
              />
            </div>
          </div>

          <div>
            <SectionTitle title="Core Tools" icon={Cpu} />
            <BentoGrid>
              {/* Featured Tool (Takes 2 columns on large screens) */}
              <BentoCard
                index={3}
                colSpan="md:col-span-2 lg:col-span-2"
                onClick={() => navigate("/installer")}
                className="bg-card hover:bg-card/80"
              >
                <div className="flex justify-between items-start h-full flex-col sm:flex-row gap-6">
                  <div className="flex flex-col justify-between h-full">
                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 w-fit mb-4 group-hover:scale-105 transition-transform duration-300">
                      <Cpu className="text-primary" size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                        Plugin Installer
                      </h2>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2 max-w-sm leading-relaxed">
                        Deploy JSX, AEX, ZXP & UXP assets securely with
                        drag-and-drop simplicity.
                      </p>
                    </div>
                  </div>
                  <div className="bg-background border border-border p-3 rounded-full group-hover:bg-primary group-hover:border-primary transition-all self-start sm:self-end">
                    <ChevronRight
                      className="text-muted-foreground group-hover:text-primary-foreground"
                      size={20}
                    />
                  </div>
                </div>
              </BentoCard>

              {/* Secondary Tools generated dynamically */}
              {filteredTools
                .filter((t: any) => t.id !== "installer")
                .map((tool: any, i: number) => (
                  <BentoCard
                    key={tool.id}
                    index={4 + i} // Stagger after the featured card
                    onClick={() =>
                      tool.status === "active" || tool.status === "beta"
                        ? navigate(tool.path)
                        : null
                    }
                  >
                    <div className="flex justify-between items-start mb-auto">
                      <div className="p-3 bg-muted rounded-xl border border-border group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                        {tool.icon}
                      </div>
                      {tool.status !== "active" && (
                        <span
                          className={`text-[8px] font-black uppercase border px-2 py-1 rounded-full ${
                            tool.status === "beta"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {tool.status}
                        </span>
                      )}
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2 line-clamp-2 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </BentoCard>
                ))}
            </BentoGrid>
          </div>

          {/* C. RECENT ACTIVITY */}
          <div>
            <SectionTitle title="Recent Activity" icon={Activity} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                      <TerminalIcon
                        size={14}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Installed "Flow_v2.jsxbin"
                      </p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">
                        Target: Scripts/ScriptUI Panels
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {i === 0
                      ? "2 min ago"
                      : i === 1
                        ? "1 hour ago"
                        : "Yesterday"}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ==========================================
// --- REUSABLE UI COMPONENTS ---
// ==========================================

function SectionTitle({ title, icon: Icon }: { title: string; icon?: any }) {
  return (
    <div className="flex items-center gap-3 mb-6 opacity-80">
      {Icon && <Icon size={14} className="text-primary" />}
      {!Icon && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h3>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  index,
}: {
  label: string;
  value: string;
  icon: any;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
        <Icon
          size={20}
          className="text-muted-foreground group-hover:text-primary transition-colors"
        />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-xl font-black italic uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

// --- BENTO GRID SYSTEM ---

function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    // Responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  index: number;
  colSpan?: string; // e.g., "md:col-span-2"
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

function BentoCard({
  children,
  index,
  colSpan = "col-span-1",
  onClick,
  disabled,
  className = "",
}: BentoCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      whileHover={disabled ? {} : { scale: 1.01, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden text-left p-6 md:p-8 rounded-[2rem] border border-border transition-all duration-300 group
        ${disabled ? "opacity-50 cursor-not-allowed bg-muted/20" : "bg-card hover:border-primary/50 hover:shadow-xl cursor-pointer"}
        ${colSpan}
        ${className}
      `}
    >
      {/* Subtle background glow effect on hover */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </motion.button>
  );
}
