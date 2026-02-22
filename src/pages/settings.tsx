import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Settings as SettingsIcon, Monitor, 
  Zap, Shield, Terminal, RefreshCw, CheckCircle, 
  AlertCircle
} from "lucide-react";
import { useAppStore } from "../store/use-appstore";
import { Switch } from "../components/ui/switch"; 

const TABS = [
  { id: "general", label: "General", icon: Monitor },
  { id: "updates", label: "Updates", icon: RefreshCw },
  { id: "advanced", label: "Developer", icon: Terminal },
  { id: "about", label: "About", icon: Shield },
];

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, updateSettings, targetAE, setTargetAE, aeVersions } = useAppStore();

  // 1. ROUTING LOGIC: Determine active tab from URL
  const pathParts = location.pathname.split('/');
  const currentPathEnd = pathParts[pathParts.length - 1];
  const activeTab = currentPathEnd === 'settings' ? 'general' : currentPathEnd;

  // 2. DEFAULT REDIRECT: Force /settings to /settings/general
  useEffect(() => {
    if (location.pathname === '/settings' || location.pathname === '/settings/') {
      navigate('/settings/general', { replace: true });
    }
  }, [location.pathname, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const THEME_COLORS = [
    { id: 'violet', hex: '#8b5cf6' },
    { id: 'blue', hex: '#3b82f6' },
    { id: 'green', hex: '#10b981' },
    { id: 'yellow', hex: '#eab308' },
    { id: 'orange', hex: '#f97316' },
    { id: 'rose', hex: '#f43f5e' },
    { id: 'slate', hex: '#64748b' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans selection:bg-primary/30">
      
      {/* SIDEBAR */}
      <div className="w-64 border-r border-border bg-sidebar backdrop-blur-xl p-6 flex flex-col gap-8">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-black uppercase tracking-widest group mb-4"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Hub
        </button>

        <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter mb-1 flex items-center gap-3 text-foreground">
                <SettingsIcon className="text-muted-foreground" /> Settings
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Configuration</p>
        </div>

        <nav className="flex flex-col gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(`/settings/${tab.id}`)}
              className={`
                flex items-center gap-3 p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                ${activeTab === tab.id 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_-5px_var(--color-primary)]" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"}
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* --- GENERAL TAB --- */}
          {activeTab === "general" && (
            <motion.div 
              key="general" variants={containerVariants} initial="hidden" animate="visible" exit="exit"
              className="max-w-2xl space-y-8"
            >
              <SectionHeader title="Global Environment" desc="Configure your primary After Effects target" />
              
              <SettingCard>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Target Application</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Select which version receives plugins</p>
                    </div>
                    <select 
                        value={targetAE}
                        onChange={(e) => setTargetAE(e.target.value)}
                        className="bg-muted/50 border border-border text-foreground text-xs font-bold uppercase py-2 px-4 rounded-lg outline-none focus:border-primary transition-colors"
                    >
                        {aeVersions.map((v:any) => <option key={v} value={v}>After Effects {v}</option>)}
                    </select>
                </div>
              </SettingCard>

              <SectionHeader title="Appearance" desc="Customize the interface look and feel" />
              
              <SettingCard>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Theme Mode</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Select your base interface color</p>
                    </div>
                    <select 
                        value={settings.themeMode}
                        onChange={(e) => updateSettings({ themeMode: e.target.value as any })}
                        className="bg-muted/50 border border-border text-foreground text-xs font-bold uppercase py-2 px-4 rounded-lg outline-none focus:border-primary transition-colors"
                    >
                        <option value="system">System Default</option>
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                    </select>
                </div>
              </SettingCard>

              <SettingCard>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Accent Color</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Primary highlight color</p>
                    </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                    {THEME_COLORS.map((color) => (
                        <button
                            key={color.id}
                            title={color.id}
                            onClick={() => updateSettings({ accentColor: color.id as any })}
                            className={`
                              w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all
                              ${settings.accentColor === color.id 
                                ? 'border-foreground scale-110 shadow-lg' 
                                : 'border-transparent opacity-50 hover:opacity-100'}
                            `}
                            style={{ backgroundColor: color.hex }}
                        >
                            {settings.accentColor === color.id && <CheckCircle size={16} className="text-white drop-shadow-md mix-blend-overlay" />}
                        </button>
                    ))}
                </div>
              </SettingCard>
            </motion.div>
          )}

          {/* --- UPDATES TAB --- */}
          {activeTab === "updates" && (
            <motion.div 
                key="updates" variants={containerVariants} initial="hidden" animate="visible" exit="exit"
                className="max-w-2xl space-y-8"
            >
                <SectionHeader title="Update Channel" desc="Manage how you receive new features" />
                
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => updateSettings({ updateChannel: 'stable' })}
                        className={`p-6 rounded-2xl border text-left transition-all ${settings.updateChannel === 'stable' ? 'bg-primary/10 border-primary/50' : 'bg-card border-border hover:border-muted-foreground'}`}
                    >
                        <Shield className={`mb-4 ${settings.updateChannel === 'stable' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <h3 className="text-sm font-bold text-foreground">Stable Channel</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">Recommended. Only heavily tested and verified updates.</p>
                    </button>

                    <button 
                        onClick={() => updateSettings({ updateChannel: 'beta' })}
                        className={`p-6 rounded-2xl border text-left transition-all ${settings.updateChannel === 'beta' ? 'bg-primary/10 border-primary/50' : 'bg-card border-border hover:border-muted-foreground'}`}
                    >
                        <Zap className={`mb-4 ${settings.updateChannel === 'beta' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <h3 className="text-sm font-bold text-foreground">Beta Channel</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">Get features early. May contain bugs or unverified tools.</p>
                    </button>
                </div>

                <SettingCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-foreground">Auto-Check Updates</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Check for new versions on startup</p>
                        </div>
                        <Switch 
                            checked={settings.autoUpdate} 
                            onCheckedChange={(c) => updateSettings({ autoUpdate: c })} 
                        />
                    </div>
                </SettingCard>
            </motion.div>
          )}

           {/* --- DEVELOPER TAB --- */}
           {activeTab === "advanced" && (
            <motion.div 
                key="advanced" variants={containerVariants} initial="hidden" animate="visible" exit="exit"
                className="max-w-2xl space-y-8"
            >
                <SectionHeader title="Advanced" desc="Tools for plugin developers" />
                
                <SettingCard>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-foreground">Developer Mode</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Enable verbose logs and raw sidecar access</p>
                        </div>
                        <Switch 
                            checked={settings.developerMode} 
                            onCheckedChange={(c) => updateSettings({ developerMode: c })} 
                        />
                    </div>
                    
                    {settings.developerMode && (
                        <div className="mt-4 p-4 bg-background/50 rounded-xl border border-border">
                             <p className="text-[10px] font-mono text-primary mb-2">$ sidecar status</p>
                             <div className="text-[10px] font-mono text-muted-foreground">
                                PID: 4421<br/>
                                Bridge: Connected<br/>
                                Socket: Active
                             </div>
                        </div>
                    )}
                </SettingCard>
                
                <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 flex items-start gap-4">
                    <AlertCircle className="text-destructive shrink-0" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-destructive">Danger Zone</h3>
                        <p className="text-[10px] text-destructive/70 mt-1 mb-3">Clear all cached versions and reset database.</p>
                        <button className="bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/50 px-3 py-1.5 rounded text-[10px] font-black uppercase transition-colors">
                            Reset Database
                        </button>
                    </div>
                </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SectionHeader({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="mb-6 border-b border-border pb-4">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground">{title}</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{desc}</p>
        </div>
    )
}

function SettingCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-6 bg-card border border-border rounded-2xl hover:border-muted-foreground/50 transition-colors">
            {children}
        </div>
    )
}
