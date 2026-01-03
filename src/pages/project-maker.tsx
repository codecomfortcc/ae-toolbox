import { useNavigate } from "react-router-dom";
import { ChevronLeft, Rocket, Construction, ArrowRight } from "lucide-react";

export default function ProjectMaker() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 p-8 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(#3f3f46 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-300px bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <nav className="relative z-10">
        <button 
          onClick={() => navigate("/")} 
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center mt-32">
        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-tighter mb-8 animate-pulse">
          <Construction size={12} />
          Phase: Alpha Development
        </div>

        {/* Hero Section */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
          <Rocket size={80} className="relative text-white mb-4 drop-shadow-2xl" />
        </div>

        <div className="text-center max-w-md">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
            Project <span className="text-blue-500">Creator</span>
          </h1>
          <p className="text-zinc-400 font-medium text-sm leading-relaxed mb-10">
            We're building a powerful engine to streamline your workflow. 
            This module is currently being fine-tuned for performance.
          </p>
        </div>

        {/* Visual Progress Indicator */}
        <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold uppercase text-zinc-500">Module Readiness</span>
            <span className="text-[10px] font-mono text-blue-500">65%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[65%] shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate("/")}
          className="mt-12 flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-tighter hover:bg-zinc-200 transition-colors"
        >
          Return Home <ArrowRight size={16} />
        </button>
      </main>
    </div>
  );
}
