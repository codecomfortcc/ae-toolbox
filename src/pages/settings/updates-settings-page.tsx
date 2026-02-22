import { ShieldCheck, Zap, FlaskConical, Info, DownloadCloud, Bell, RefreshCw } from "lucide-react";
import { useAppStore } from "../../store/use-appstore";
import { useAutoUpdate } from "../../hooks/use-updater"; 
import { SectionHeader, SettingCard, Switch } from "../../components/settings/compoents";

export default function UpdateSettings() {
  const { settings, updateSettings, isProcessing } = useAppStore();
  const { checkForUpdates } = useAutoUpdate();

  return (
    <>
      <SectionHeader 
        title="Release Channels" 
        desc="Choose how you want to receive new features and fixes" 
      />
      
      {/* CHANNEL SELECTORS */}
      <SettingCard index={0}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Stable Channel */}
            <button 
                onClick={() => updateSettings({ updateChannel: 'stable' })}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                    settings.updateChannel === 'stable' 
                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_-3px_var(--color-primary)]' 
                    : 'bg-background border-border hover:border-muted-foreground'
                }`}
            >
                <ShieldCheck className={`mb-3 ${settings.updateChannel === 'stable' ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-sm font-bold text-foreground">Stable</h3>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    Highly tested. Best for production workflows.
                </p>
            </button>

            {/* Beta Channel */}
            <button 
                onClick={() => updateSettings({ updateChannel: 'beta' })}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                    settings.updateChannel === 'beta' 
                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_-3px_var(--color-primary)]' 
                    : 'bg-background border-border hover:border-muted-foreground'
                }`}
            >
                <Zap className={`mb-3 ${settings.updateChannel === 'beta' ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-sm font-bold text-foreground">Beta</h3>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    Early access to new tools. May contain minor bugs.
                </p>
            </button>

            {/* Alpha Channel */}
            <button 
                onClick={() => updateSettings({ updateChannel: 'alpha' })}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                    settings.updateChannel === 'alpha' 
                    ? 'bg-destructive/10 border-destructive shadow-[0_0_15px_-3px_var(--color-destructive)]' 
                    : 'bg-background border-border hover:border-muted-foreground'
                }`}
            >
                <FlaskConical className={`mb-3 ${settings.updateChannel === 'alpha' ? 'text-destructive' : 'text-muted-foreground'}`} />
                <h3 className="text-sm font-bold text-foreground">Alpha (Nightly)</h3>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    Bleeding edge. Unstable. For developers only.
                </p>
            </button>
        </div>

        {/* Informational Banner on How Updates Work */}
        <div className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-xl">
            <Info size={16} className="text-primary shrink-0 mt-0.5" />
            <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground">How channel switching works</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    When you switch channels, AE Toolbox will securely fetch the cryptographic signature for that specific branch. The new version will seamlessly replace your current installation the next time you restart the app, preserving all your local settings and plugin vault data.
                </p>
            </div>
        </div>
      </SettingCard>

      <div className="mt-10" />

      <SectionHeader 
        title="Update Preferences" 
        desc="Automate your update workflow" 
      />

      {/* UPDATE BEHAVIORS */}
      <SettingCard index={1}>
        <div className="space-y-6">
            
            {/* Toggle 1: Auto-Check */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg border border-border"><RefreshCw size={16} className="text-muted-foreground"/></div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Auto-Check on Startup</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Query GitHub for new releases when app opens</p>
                    </div>
                </div>
                <Switch 
                    checked={settings.autoUpdate} 
                    onCheckedChange={(c) => updateSettings({ autoUpdate: c })} 
                />
            </div>

            <div className="h-px w-full bg-border" />

            {/* Toggle 2: Auto-Download */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg border border-border"><DownloadCloud size={16} className="text-muted-foreground"/></div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Background Downloads</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Download updates silently while you work</p>
                    </div>
                </div>
                <Switch 
                    checked={settings.autoDownload} 
                    onCheckedChange={(c) => updateSettings({ autoDownload: c })} 
                />
            </div>

            <div className="h-px w-full bg-border" />

            {/* Toggle 3: Major Only */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg border border-border"><Bell size={16} className="text-muted-foreground"/></div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Notify Major Only</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Ignore minor patches (e.g. v1.1.2) unless critical</p>
                    </div>
                </div>
                <Switch 
                    checked={settings.notifyMajorOnly} 
                    onCheckedChange={(c) => updateSettings({ notifyMajorOnly: c })} 
                />
            </div>

        </div>
      </SettingCard>

      <div className="mt-10" />

      {/* SYSTEM STATUS & MANUAL CHECK */}
      <SectionHeader 
        title="System Status" 
        desc="Current engine version" 
      />

      <SettingCard index={2}>
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">v0.5.0 <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full not-italic tracking-widest ml-2 border border-primary/20">{settings.updateChannel}</span></h3>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">Last checked: Today, 10:42 AM</p>
            </div>
            
            <button 
                onClick={() => checkForUpdates()}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
                <RefreshCw size={14} className={isProcessing ? "animate-spin" : ""} />
                {isProcessing ? "Checking..." : "Check Now"}
            </button>
        </div>
      </SettingCard>
    </>
  );
}
