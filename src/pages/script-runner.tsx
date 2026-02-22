import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ArrowRight, FileCode2, 
    LayoutTemplate, TerminalSquare, Waypoints 
} from "lucide-react";

type Step = 1 | 2 | 3;
type Architecture = "jsx" | "cep" | null;
type DevMode = "script" | "blueprint" | null;

export default function ScriptRunner() {
  const navigate = useNavigate();
  
  // Wizard State
  const [step, setStep] = useState<Step>(1);
  const [architecture, setArchitecture] = useState<Architecture>(null);
  const [pluginName, setPluginName] = useState("");

  // Handlers
  const handleNext = () => setStep((s) => (s + 1) as Step);
  const handleBack = () => setStep((s) => (s - 1) as Step);

  const handleFinish = (selectedMode: DevMode) => {
    // Route to the correct editor shell based on selection
    if (selectedMode === "blueprint") {
        navigate(`/editor/blueprint?arch=${architecture}&name=${encodeURIComponent(pluginName)}`);
    } else {
        navigate(`/editor/script?arch=${architecture}&name=${encodeURIComponent(pluginName)}`);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden relative selection:bg-primary/30">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary/5 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />

      {/* TOP NAVIGATION */}
      <header className="p-6 md:p-8 relative z-20 flex items-center justify-between">
        <button 
            onClick={() => step === 1 ? navigate("/") : handleBack()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-black uppercase tracking-widest group"
        >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {step === 1 ? "Cancel" : "Back"}
        </button>

        {/* Step Indicator */}
        <div className="flex gap-2">
            {[1, 2, 3].map(s => (
                <div 
                    key={s} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                        s === step ? 'w-8 bg-primary shadow-[0_0_10px_var(--color-primary)]' : 
                        s < step ? 'w-4 bg-primary/50' : 'w-4 bg-muted/50'
                    }`} 
                />
            ))}
        </div>
      </header>

      {/* WIZARD CONTENT */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ARCHITECTURE */}
            {step === 1 && (
              <WizardStep key="step1">
                <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-4">
                        Target <span className="text-muted-foreground">Architecture</span>
                    </h1>
                    <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Select the foundation for your new tool</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <SelectionCard 
                        active={architecture === "jsx"}
                        onClick={() => { setArchitecture("jsx"); handleNext(); }}
                        icon={FileCode2}
                        title="ExtendScript (.JSX)"
                        desc="Lightweight UI scripts. Native AE integration. Best for simple utility panels and automation."
                    />
                    <SelectionCard 
                        active={architecture === "cep"}
                        onClick={() => { setArchitecture("cep"); handleNext(); }}
                        icon={LayoutTemplate}
                        title="CEP Extension"
                        desc="Powered by bolt-cep. Full HTML/CSS/JS environments. Best for complex, modern interfaces."
                    />
                </div>
              </WizardStep>
            )}

            {/* STEP 2: PLUGIN NAME */}
            {step === 2 && (
              <WizardStep key="step2">
                 <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-4">
                        Plugin <span className="text-muted-foreground">Identity</span>
                    </h1>
                    <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Give your creation a name</p>
                </div>
                
                <div className="max-w-xl mx-auto flex flex-col gap-6">
                    <input 
                        type="text"
                        autoFocus
                        value={pluginName}
                        onChange={(e) => setPluginName(e.target.value)}
                        placeholder="E.G., COLOR_MASTER_V1"
                        className="w-full bg-card/50 backdrop-blur-sm border-2 border-border focus:border-primary rounded-2xl px-6 py-6 text-xl md:text-2xl font-black uppercase tracking-wider text-center outline-none transition-all placeholder:text-muted shadow-lg"
                        onKeyDown={(e) => e.key === 'Enter' && pluginName.trim() && handleNext()}
                    />
                    <button 
                        disabled={!pluginName.trim()}
                        onClick={handleNext}
                        className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 flex items-center justify-center gap-3 shadow-[0_0_20px_-5px_var(--color-primary)] disabled:shadow-none"
                    >
                        Continue <ArrowRight size={16} />
                    </button>
                </div>
              </WizardStep>
            )}

            {/* STEP 3: CREATION MODE */}
            {step === 3 && (
              <WizardStep key="step3">
                <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-4">
                        Development <span className="text-muted-foreground">Mode</span>
                    </h1>
                    <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">How do you want to build this?</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <SelectionCard 
                        onClick={() => handleFinish("script")}
                        icon={TerminalSquare}
                        title="Script Mode"
                        desc="Traditional coding environment. Split-screen syntax highlighting with live UI preview rendering."
                    />
                    <SelectionCard 
                        onClick={() => handleFinish("blueprint")}
                        icon={Waypoints}
                        title="Blueprint Engine"
                        desc="Visual Geometry-Node builder. Drag & drop interfaces and wire logic visually without writing code."
                        highlight
                    />
                </div>
              </WizardStep>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// --- HELPERS ---
// ==========================================

function WizardStep({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
        >
            {children}
        </motion.div>
    )
}

function SelectionCard({ active, onClick, icon: Icon, title, desc, highlight }: any) {
    return (
        <button 
            onClick={onClick}
            className={`
                group relative text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 overflow-hidden
                ${active ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}
                ${highlight ? 'ring-1 ring-primary/30 shadow-[0_0_30px_-10px_var(--color-primary)]' : ''}
            `}
        >
            {/* Highlight Glow Effect */}
            {highlight && <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 pointer-events-none" />}
            
            <div className={`
                p-4 rounded-2xl w-fit mb-6 transition-colors duration-300
                ${highlight ? 'bg-primary/20 text-primary' : 'bg-muted border border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30'}
                ${active ? 'bg-primary text-primary-foreground border-transparent' : ''}
            `}>
                <Icon size={28} />
            </div>
            
            <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-foreground mb-2 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                {desc}
            </p>
        </button>
    )
}
