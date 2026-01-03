import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Puzzle, Rocket, Cpu, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Plugin Installer",
      desc: "Deploy JSX, AEX, ZXP & UXP assets",
      icon: <Puzzle className="w-8 h-8 text-purple-500" />,
      path: "/installer",
      color: "hover:border-purple-500/50",
      glow: "group-hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]",
    },
    {
      title: "Project Creator",
      desc: "Initialize new AE project structures",
      icon: <Rocket className="w-8 h-8 text-blue-500" />,
      path: "/project-create",
      color: "hover:border-blue-500/50",
      glow: "group-hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* 1. BACKGROUND DECORATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
        />  
        {/* Animated Glow Blobs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" 
        />
      </div>

      {/* 2. LOGO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 mb-16 relative z-10"
      >
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
          <Cpu className="text-purple-500" size={48} />
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-black tracking-[ -0.05em] uppercase italic leading-none">
            AE <span className="text-zinc-500">Toolbox</span>
          </h1>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-600 mt-3">
             Workflow Engine v0.5
          </p>
        </div>
      </motion.div>

      {/* 3. TOOLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        {tools.map((tool, i) => (
          <motion.button
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(tool.path)}
            className={`
              flex flex-col items-start p-10 bg-zinc-900/40 border border-zinc-800/80 
              backdrop-blur-xl rounded-[3rem] text-left transition-all relative
              ${tool.color} ${tool.glow} group
            `}
          >
            {/* Inner Sheen Effect */}
            <div className="absolute inset-0 rounded-[3rem] bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* Icon Container */}
            <div className="mb-8 p-5 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:scale-110 group-hover:bg-zinc-900 transition-all duration-500">
              {tool.icon}
            </div>

            <div className="flex justify-between items-end w-full">
              <div className="flex-1">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-white transition-colors">
                  {tool.title}
                </h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-50">
                  {tool.desc}
                </p>
              </div>
              
              {/* Animated Arrow */}
              <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                <ChevronRight className="text-zinc-400" size={24} />
              </div>
            </div>

            {/* Bottom Tech Bar */}
            <div className="absolute bottom-6 left-10 right-10 h-px bg-zinc-800/50 overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                  className={`h-full w-1/2 bg-linear-to-r from-transparent via-current to-transparent opacity-30 ${tool.title.includes('Plugin') ? 'text-purple-500' : 'text-blue-500'}`}
                />
            </div>
          </motion.button>
        ))}
      </div>

      {/* 4. FOOTER TECH DATA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex gap-8 border-t border-zinc-900 pt-8"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">System Status</span>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">● Operational</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Host Link</span>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">After Effects 2025</span>
        </div>
      </motion.div>

    </div>
  );
}
