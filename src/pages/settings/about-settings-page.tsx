import { 
    Cpu, Github, Book, MessageSquare, 
    Globe, Heart, Activity, Info, ExternalLink 
} from "lucide-react";
import { SectionHeader, SettingCard } from "../../components/settings/compoents"; // Adjust path if needed

export default function AboutSettings() {
  return (
    <>
      <SectionHeader 
        title="About AE Toolbox" 
        desc="The ultimate workflow engine for After Effects" 
      />

      {/* 1. BRANDING & VERSION */}
      <SettingCard index={0}>
        <div className="flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20 shadow-[0_0_30px_-10px_var(--color-primary)] mb-6 relative group">
                {/* Subtle pulse on the glow instead of aggressive hover */}
                <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-700 rounded-full pointer-events-none" />
                <Cpu size={48} className="text-primary relative z-10" />
            </div>
            
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-foreground mb-2">
                AE <span className="text-muted-foreground">Toolbox</span>
            </h1>
            
            <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-widest text-foreground bg-muted px-3 py-1 rounded-full border border-border">
                    Version 0.5.0
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    Beta
                </span>
            </div>
            
            <p className="text-xs text-muted-foreground mt-6 max-w-md mx-auto leading-relaxed">
                Built to bridge the gap between creative workflows and modern software engineering. 
                Deploy, manage, and build Adobe After Effects assets with military-grade precision.
            </p>
        </div>
      </SettingCard>

      <div className="mt-8" />

      {/* 2. RESOURCES & LINKS */}
      <SettingCard index={1}>
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Globe size={14} /> Resources & Community
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResourceLink 
                icon={Book} 
                title="Documentation" 
                desc="Read the manual and API guides" 
                url="https://docs.aetoolbox.com" 
            />
            <ResourceLink 
                icon={Github} 
                title="GitHub Repository" 
                desc="Source code and issue tracker" 
                url="https://github.com/yourusername/ae-toolbox" 
            />
            <ResourceLink 
                icon={MessageSquare} 
                title="Discord Community" 
                desc="Chat with other developers" 
                url="https://discord.gg/aetoolbox" 
            />
            <ResourceLink 
                icon={Heart} 
                title="Support the Project" 
                desc="Help keep AE Toolbox open-source" 
                url="https://github.com/sponsors/yourusername" 
            />
        </div>
      </SettingCard>

      <div className="mt-8" />

      {/* 3. SYSTEM DIAGNOSTICS */}
      <SettingCard index={2}>
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Activity size={14} /> System Diagnostics
        </h3>
        
        <div className="bg-muted/30 border border-border rounded-xl p-1 overflow-hidden">
            <DiagnosticRow label="OS Engine" value="Windows_NT 10.0.22631 (x64)" />
            <DiagnosticRow label="Tauri Version" value="2.0.0-beta" />
            <DiagnosticRow label="WebView" value="WebView2 (EdgeHTML 120.0.2210.91)" />
            <DiagnosticRow label="Rust Toolchain" value="stable-x86_64-pc-windows-msvc" />
            <DiagnosticRow label="Cryptography" value="Ed25519 (Minisign Verified)" isLast />
        </div>
      </SettingCard>

      {/* 4. LEGAL / COPYRIGHT */}
      <div className="mt-12 text-center flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
          <Info size={16} className="text-muted-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center px-4">
              &copy; {new Date().getFullYear()} Code Comfort. All rights reserved.
          </p>
          <p className="text-[9px] font-mono text-muted-foreground/50">
              MIT License • Built with Rust & React
          </p>
      </div>
    </>
  );
}

// --- HELPER COMPONENTS ---

function ResourceLink({ icon: Icon, title, desc, url }: any) {
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:border-border/80 transition-all duration-300 group"
        >
            {/* Icon Box: Subtly shifts to primary colors on hover */}
            <div className="p-2.5 bg-muted rounded-xl border border-border group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors duration-300 shrink-0">
                <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            
            {/* Text Content: min-w-0 ensures truncation works properly on flex children */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    {/* Title stays its natural color, just simple and clean */}
                    <h4 className="text-sm font-bold text-foreground truncate">{title}</h4>
                    
                    {/* Slide-in External Link Arrow */}
                    <ExternalLink 
                        size={14} 
                        className="text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0" 
                    />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wide leading-relaxed line-clamp-2">
                    {desc}
                </p>
            </div>
        </a>
    );
}

function DiagnosticRow({ label, value, isLast = false }: { label: string, value: string, isLast?: boolean }) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 ${!isLast ? 'border-b border-border/50' : ''}`}>
            <span className="text-xs font-bold text-muted-foreground shrink-0">{label}</span>
            <span 
                className="text-[10px] font-mono text-foreground bg-background px-2 py-1 rounded border border-border truncate max-w-full text-left sm:text-right"
                title={value} // Hover tooltip in case it gets truncated on tiny screens
            >
                {value}
            </span>
        </div>
    );
}
