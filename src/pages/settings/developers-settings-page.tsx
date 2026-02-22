import { motion, AnimatePresence } from "framer-motion";
import { 
    Terminal, AlertTriangle, Bug, FileJson, 
    Server, Activity, Trash2, ShieldAlert
} from "lucide-react";
import { useAppStore } from "../../store/use-appstore";
import { SectionHeader, SettingCard, Switch } from "../../components/settings/compoents";

export default function DevelopersSettings() {
  const { settings, updateSettings } = useAppStore();

  return (
    <>
      <SectionHeader 
        title="Developer Options" 
        desc="Advanced tools for plugin creators and debugging" 
      />
      
      {/* 1. MASTER TOGGLE */}
      <SettingCard index={0} className="px-5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-xl border border-border">
                    <Terminal size={20} className="text-primary" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-foreground">Enable Developer Mode</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                        Unlock raw sidecar access, telemetry, and destructive actions
                    </p>
                </div>
            </div>
            <Switch 
                checked={settings.developerMode} 
                onCheckedChange={(c) => updateSettings({ developerMode: c })} 
            />
        </div>
      </SettingCard>

      {/* REVEALED DEVELOPER SETTINGS */}
      <AnimatePresence>
        {settings.developerMode && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-8 mt-8 overflow-hidden px-8"
          >
            <SectionHeader 
                title="Debugging & Diagnostics" 
                desc="Monitor application behavior" 
            />

            {/* 2. DEBUGGING TOOLS */}
            <SettingCard index={1}>
                <div className="space-y-6">
                    {/* Verbose Logs */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bug size={16} className="text-muted-foreground"/>
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Verbose IPC Logging</h3>
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Log all Tauri to Rust bridge payloads</p>
                            </div>
                        </div>
                        <Switch 
                            checked={settings.enableDebugLogs} 
                            onCheckedChange={(c) => updateSettings({ enableDebugLogs: c })} 
                        />
                    </div>

                    <div className="h-px w-full bg-border" />

                    {/* CEF Debugging */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileJson size={16} className="text-muted-foreground"/>
                            <div>
                                <h3 className="text-sm font-bold text-foreground">CEF Debugging Port</h3>
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">For Chrome DevTools in AE Panels (Requires AE Restart)</p>
                            </div>
                        </div>
                        <input 
                            type="number" 
                            value={settings.cefDebuggingPort || 8092}
                            onChange={(e) => updateSettings({ cefDebuggingPort: parseInt(e.target.value) })}
                            className="bg-muted/50 border border-border rounded-lg px-3 py-1 text-xs font-mono text-foreground outline-none focus:border-primary w-24 text-center"
                        />
                    </div>

                    <div className="h-px w-full bg-border" />

                    {/* Unsigned Plugins */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldAlert size={16} className="text-destructive"/>
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Allow Unsigned Assets</h3>
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Bypass Ed25519 verification for local development</p>
                            </div>
                        </div>
                        <Switch 
                            checked={settings.bypassSignatures} 
                            onCheckedChange={(c) => updateSettings({ bypassSignatures: c })} 
                        />
                    </div>
                </div>
            </SettingCard>

            {/* 3. SIDECAR TELEMETRY */}
            <SettingCard index={2}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Server size={16} className="text-foreground" />
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Sidecar Telemetry</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <Activity size={12} /> Connected
                    </div>
                </div>
                
                {/* Simulated Terminal Output */}
                <div className="p-4 bg-[#09090b] rounded-xl border border-border font-mono text-[10px] text-muted-foreground leading-relaxed overflow-x-auto">
                    <div className="flex gap-4"><span className="text-primary">PID:</span> <span className="text-zinc-300">44214</span></div>
                    <div className="flex gap-4"><span className="text-primary">Socket:</span> <span className="text-zinc-300">IPC_ACTIVE</span></div>
                    <div className="flex gap-4"><span className="text-primary">Uptime:</span> <span className="text-zinc-300">02:14:33</span></div>
                    <div className="flex gap-4"><span className="text-primary">Mem:</span> <span className="text-zinc-300">14.2 MB</span></div>
                    <div className="mt-2 text-emerald-500 border-t border-zinc-800/50 pt-2">
                        [OK] Bridge initialized.<br/>
                        [OK] Listening for AE Toolbox jobs...
                    </div>
                </div>
            </SettingCard>

            <div className="mt-12" />

            <SectionHeader 
                title="Danger Zone" 
                desc="Destructive actions. Proceed with caution." 
            />

            {/* 4. DANGER ZONE */}
            <SettingCard index={3}>
                <div className="p-1 rounded-2xl border border-destructive/30 bg-destructive/5 relative overflow-hidden">
                    {/* Warning Stripes Background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, var(--color-destructive) 10px, var(--color-destructive) 20px)' }}
                    />
                    
                    <div className="relative z-10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20 shrink-0">
                                <AlertTriangle className="text-destructive" size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-destructive">Factory Reset</h3>
                                <p className="text-[10px] text-destructive/70 mt-1 mb-2 leading-relaxed max-w-sm">
                                    This will wipe the SQLite database, clear all cached plugin versions, and reset your configuration to defaults. Installed plugins in After Effects will <strong className="text-destructive">not</strong> be deleted, but AE Toolbox will lose track of them.
                                </p>
                            </div>
                        </div>
                        
                        <button className="flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground border border-destructive/50 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all group shrink-0">
                            <Trash2 size={16} className="group-hover:animate-bounce" />
                            Wipe Data
                        </button>
                    </div>
                </div>
            </SettingCard>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
