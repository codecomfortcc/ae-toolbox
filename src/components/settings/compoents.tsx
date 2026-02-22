import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// --- SECTION HEADER ---
interface SectionHeaderProps {
  title: string;
  desc: string;
}
interface SectionProps {

  children: React.ReactNode;
  className?: string;
}

export function Section({ children,className }: SectionProps) {
  return (
    <section className={cn("mb-12 last:mb-0", className)}>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}
export function SectionHeader({ title, desc }: SectionHeaderProps) {
  return (
    <div className="mb-6 border-b border-border pb-4">
      <h2 className="text-xl font-black uppercase italic tracking-tight text-foreground">
        {title}
      </h2>
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
        {desc}
      </p>
    </div>
  );
}

// --- ANIMATED SETTING CARD ---
interface SettingCardProps {
  children: React.ReactNode;
  index?: number; // Used to stagger the entry animations (0, 1, 2...)
  className?: string;
}

export function SettingCard({ children, index = 0, className }: SettingCardProps) {
  return (
    <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
    
      transition={{ 
        delay: index * 0.1, 
        duration: 0.4, 
        ease: "easeOut" 
      }}
      whileHover={{ scale: 1.001, y: -2 }}
      className={cn("relative p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-colors duration-300 group", className)}
    >

      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// --- ANIMATED TOGGLE SWITCH ---
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`
        w-10 h-5 rounded-full p-1 flex items-center transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${checked ? "bg-primary" : "bg-muted border border-border"}
      `}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="w-3 h-3 bg-white rounded-full shadow-md"
        style={{ 
          marginLeft: checked ? "auto" : "0", 
          marginRight: checked ? "0" : "auto" 
        }}
      />
    </button>
  );
}
