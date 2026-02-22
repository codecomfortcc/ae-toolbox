import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { AlertOctagon, RefreshCcw, Power, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const navigate = useNavigate();
  const [isRecovering, setIsRecovering] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // --- MOUSE SPOTLIGHT EFFECT ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // --- FAKE TERMINAL LOGIC ---
  useEffect(() => {
    const bootLogs = [
      "FATAL ERROR: Navigation module disconnected.",
      "Searching for signal...",
      "ERR_404: Route not found in map.",
      "Stack trace:",
      "  at router.navigate (unknown:404:0)",
      "  at user.decision (brain.ts:NaN)",
      "System halted.",
    ];

    let delay = 0;
    bootLogs.forEach((log) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, delay);
    });
  }, []);

  const handleRecovery = () => {
    setIsRecovering(true);
    setLogs([]); // Clear logs

    const recoverySteps = [
      "Initiating recovery sequence...",
      "Purging cache...",
      "Reconnecting to Dashboard...",
      "Success.",
    ];

    let delay = 0;
    recoverySteps.forEach((step, i) => {
      delay += 600;
      setTimeout(() => {
        setLogs((prev) => [...prev, step]);
        if (i === recoverySteps.length - 1) {
          setTimeout(() => navigate("/"), 800);
        }
      }, delay);
    });
  };

  return (
    <div
      className="h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden select-none font-mono group"
      onMouseMove={handleMouseMove}
    >
      {/* --- 1. DYNAMIC BACKGROUND --- */}
      {/* Grid Pattern that lights up on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-20 transition duration-300 group-hover:opacity-40"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(168, 85, 247, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size:40px_40px mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%) pointer-events-none" />

      {/* --- 2. MAIN CONTENT WRAPPER --- */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* HEADER: Glitchy 404 */}
        <div className="flex items-center justify-between border-b border-border/40 pb-6 mb-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-primary animate-pulse">
              404
            </h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1">
              Runtime Exception
            </p>
          </div>
          <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center animate-pulse border border-destructive/20">
            <AlertOctagon className="text-destructive" size={24} />
          </div>
        </div>

        {/* TERMINAL WINDOW */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card/30 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Terminal Header */}
          <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
            <div className="flex-1 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              crash_report.log
            </div>
            <Cpu size={12} className="text-muted-foreground" />
          </div>

          {/* Terminal Body */}
          <ScrollArea className="h-48 p-4 font-mono text-xs">
            <div className="space-y-1">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex items-start gap-2",
                    log.includes("FATAL") || log.includes("ERR")
                      ? "text-red-400"
                      : log.includes("Success")
                        ? "text-green-400"
                        : "text-muted-foreground",
                  )}
                >
                  <span className="opacity-50 select-none">{">"}</span>
                  <span>{log}</span>
                </motion.div>
              ))}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-primary/50 mt-1"
              />
            </div>
          </ScrollArea>
        </motion.div>

        {/* ACTION AREA */}
        <div className="mt-8 flex items-center gap-4 justify-end">
          <Button
            size="lg"
            disabled={isRecovering}
            onClick={handleRecovery}
            className={cn(
              "h-12 px-8 gap-3 text-xs font-black uppercase tracking-widest transition-all",
              isRecovering
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]",
            )}
          >
            {isRecovering ? (
              <>
                <RefreshCcw size={16} className="animate-spin" />
                Recovering...
              </>
            ) : (
              <>
                <Power size={16} />
                System Reboot
              </>
            )}
          </Button>
        </div>
      </div>

      {/* DECORATIVE ELEMENTS */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <div className="absolute top-10 right-10 flex flex-col items-end gap-1 opacity-20">
        <div className="w-32 h-1 bg-white" />
        <div className="w-16 h-1 bg-white" />
        <div className="w-8 h-1 bg-white" />
      </div>
    </div>
  );
}
