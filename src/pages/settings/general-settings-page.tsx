
import { CheckCircle, FolderOpen, } from "lucide-react";
import { useAppStore } from "../../store/use-appstore";
import {
  Section,
  SectionHeader,
  SettingCard,
} from "../../components/settings/compoents";

const THEME_COLORS = [
  { id: "violet", hex: "#8b5cf6" },
  { id: "blue", hex: "#3b82f6" },
  { id: "green", hex: "#10b981" },
  { id: "yellow", hex: "#eab308" },
  { id: "orange", hex: "#f97316" },
  { id: "rose", hex: "#f43f5e" },
  { id: "slate", hex: "#64748b" },
];

export default function GeneralSettings() {
  const { targetAE, setTargetAE, aeVersions, settings, updateSettings } =
    useAppStore();

  const handleBrowseMasterLocation = async () => {
    try {
      const mockPath = "D:\\Work\\AE_Master_Projects";
      updateSettings({ masterProjectLocation: mockPath });
    } catch (error) {
      console.error("Failed to open dialog", error);
    }
  };

 
  return (
    <div className="pb-10 ">
      <Section>
        <SectionHeader
          title="Global Environment"
          desc="Configure application targets and storage locations"
        />

        <SettingCard index={0}>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Target Application
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                  Select which version receives plugins
                </p>
              </div>
              <select
                value={targetAE}
                onChange={(e) => setTargetAE(e.target.value)}
                className="bg-muted/50 border border-border text-foreground text-xs font-bold uppercase py-2 px-4 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer min-w-40"
              >
                {aeVersions.length > 0 ? (
                  aeVersions.map((v: any) => (
                    <option key={v} value={v}>
                      After Effects {v}
                    </option>
                  ))
                ) : (
                  <option value="">No versions detected</option>
                )}
              </select>
            </div>

            <div className="h-px w-full bg-border/50" />

            {/* Master Project Location */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 pr-4">
                <h3 className="text-sm font-bold text-foreground">
                  Master Project Location
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide leading-relaxed">
                  The root directory where all newly generated projects will be
                  stored
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="bg-muted/30 border border-border px-3 py-2 rounded-lg text-xs font-mono text-muted-foreground truncate w-full sm:w-48 select-all">
                  {settings.masterProjectLocation || "No folder selected..."}
                </div>
                <button
                  onClick={handleBrowseMasterLocation}
                  className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                >
                  <FolderOpen size={14} /> Browse
                </button>
              </div>
            </div>
          </div>
        </SettingCard>
      </Section>
      <Section>
        <SectionHeader
          title="Appearance"
          desc="Customize the interface look and feel"
        />

        <SettingCard index={2}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Theme Mode</h3>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                Select your base interface color
              </p>
            </div>
            <select
              value={settings.themeMode}
              onChange={(e) =>
                updateSettings({ themeMode: e.target.value as any })
              }
              className="bg-muted/50 border border-border text-foreground text-xs font-bold uppercase py-2 px-4 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer min-w-40"
            >
              <option value="system">System Default</option>
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </div>

          <div className="h-px w-full bg-border/50 mb-6" />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Accent Color
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                Primary highlight color
              </p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            {THEME_COLORS.map((color) => {
              const isActive = settings.accentColor === color.id;

              return (
                <button
                  key={color.id}
                  title={color.id.charAt(0).toUpperCase() + color.id.slice(1)}
                  onClick={() =>
                    updateSettings({ accentColor: color.id as any })
                  }
                  className={`
                  relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ease-out active:scale-95
                  ${
                    isActive
                      ? "border-foreground scale-105 shadow-[0_0_15px_-3px_var(--color-primary)]"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  }
                          `}
                  style={{ backgroundColor: color.hex }}
                >
                  {isActive && (
                    <CheckCircle
                      size={16}
                      className="text-white drop-shadow-md mix-blend-overlay"
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </SettingCard>
      </Section>
    </div>
  );
}
