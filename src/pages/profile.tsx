import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  AtSign,
  Edit2,
  Check,
  X,
  Package,
  Trophy,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "../store/use-appstore"; // Adjust path if needed

export default function Profile() {
  const { profile, updateProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="h-full w-full bg-background text-foreground p-6 md:p-12 overflow-y-auto custom-scrollbar font-sans selection:bg-primary/30 relative">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-10 right-10 w-64 md:w-96 h-64 md:h-96 bg-primary/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-10 md:space-y-12 pb-20">
        {/* 1. PROFILE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 pb-8 border-b border-border">
          <div className="relative group shrink-0 self-start md:self-auto">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-card border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-muted-foreground" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-4 border-background shadow-lg">
              Pro
            </div>
          </div>

          <div className="flex-1 mb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                {!isEditing ? (
                  <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-foreground">
                    {profile.firstName}{" "}
                    <span className="text-muted-foreground">
                      {profile.lastName}
                    </span>
                  </h1>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-2">
                    <input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-xl font-bold w-32 md:w-40 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground"
                      placeholder="First Name"
                    />
                    <input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-xl font-bold w-32 md:w-40 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground"
                      placeholder="Last Name"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <AtSign size={12} />
                    <span className="text-xs font-bold">{profile.tag}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} />
                    <span className="text-xs font-bold">{profile.email}</span>
                  </div>
                </div>
              </div>

              <div className="self-start md:self-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-muted hover:text-foreground transition-all group"
                  >
                    <Edit2
                      size={14}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="p-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={handleSave}
                      className="p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Publishes"
            value={profile.publishes.toString()}
            icon={Package}
            index={0}
          />
          <StatCard
            label="Contribution Score"
            value="Top 5%"
            icon={Trophy}
            index={1}
          />
          <StatCard label="Active Projects" value="3" icon={Layers} index={2} />
        </div>

        {/* 3. INLINE MONTHLY CALENDAR ENGINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8"
        >
          <InteractiveCalendar />
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// --- SUB COMPONENTS ---
// ==========================================

function StatCard({ label, value, icon: Icon, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="p-6 bg-card border border-border rounded-2xl group transition-all hover:border-primary/50 hover:shadow-lg relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-muted rounded-xl border border-border group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
          <Icon
            size={20}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
        </div>
        <span className="text-[9px] font-black bg-background px-2 py-1 rounded border border-border text-muted-foreground uppercase tracking-widest">
          {new Date().getFullYear()}
        </span>
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
          {value}
        </h2>
        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mt-1">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// --- CALENDAR ENGINE ---

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function InteractiveCalendar() {
  // Logic Constraints
  const JOIN_YEAR = 2024; // Do not show years before account creation
  const CURRENT_DATE = new Date();

  // State
  const [selectedYear, setSelectedYear] = useState(CURRENT_DATE.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_DATE.getMonth()); // 0 = Jan, 11 = Dec

  // Handlers
  const handlePrevYear = () => {
    if (selectedYear > JOIN_YEAR) setSelectedYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    if (selectedYear < CURRENT_DATE.getFullYear())
      setSelectedYear((prev) => prev + 1);
  };

  // Grid Math: Calculate days to show and offsets
  const calendarData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const startDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sun

    // Mock data generator for visual testing.
    // In reality, you'd fetch this from your backend based on selectedMonth/Year
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      // Randomize activity for realism
      const creations = Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0;
      const changes = Math.random() > 0.4 ? Math.floor(Math.random() * 8) : 0;
      const totalActivity = creations + changes;

      let intensity = 0;
      if (totalActivity > 0) intensity = 1;
      if (totalActivity > 5) intensity = 2;
      if (totalActivity > 10) intensity = 3;

      days.push({ day: i, creations, changes, totalActivity, intensity });
    }
    return { startDayOfWeek, days };
  }, [selectedYear, selectedMonth]);

  return (
    <div className="space-y-8">
      {/* 1. INLINE CONTROLS (Year & Month) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* Year Selector */}
        <div className="flex items-center gap-4 bg-muted/30 border border-border p-1.5 rounded-xl w-fit">
          <button
            onClick={handlePrevYear}
            disabled={selectedYear <= JOIN_YEAR}
            className="p-1.5 rounded-lg hover:bg-background disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-black uppercase tracking-widest px-4">
            {selectedYear}
          </span>
          <button
            onClick={handleNextYear}
            disabled={selectedYear >= CURRENT_DATE.getFullYear()}
            className="p-1.5 rounded-lg hover:bg-background disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Month Tabs (Scrollable on small screens) */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-2 xl:pb-0 w-full xl:w-auto">
          {MONTHS.map((month, index) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(index)}
              className={`
                                px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shrink-0
                                ${
                                  selectedMonth === index
                                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_-3px_var(--color-primary)]"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }
                            `}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THE GRID */}
      <div>
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {/* Empty cells to push the first day to the correct column */}
          {Array.from({ length: calendarData.startDayOfWeek }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square bg-transparent rounded-xl"
            />
          ))}

          {/* Actual Day Cells */}
          {calendarData.days.map((data) => {
            // Theme mapping based on intensity
            let bgClass =
              "bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted"; // 0 activity
            if (data.intensity === 1)
              bgClass =
                "bg-primary/20 border-primary/30 text-foreground hover:bg-primary/30";
            if (data.intensity === 2)
              bgClass =
                "bg-primary/60 border-primary/70 text-primary-foreground hover:bg-primary/70";
            if (data.intensity === 3)
              bgClass =
                "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_-3px_var(--color-primary)]";

            return (
              <div
                key={data.day}
                className={`
                                    relative aspect-square rounded-xl md:rounded-2xl border flex items-center justify-center transition-all duration-300 group cursor-pointer
                                    ${bgClass}
                                `}
              >
                {/* Date Number */}
                <span
                  className={`text-xs md:text-sm font-black ${data.intensity > 1 ? "opacity-100" : "opacity-70"}`}
                >
                  {data.day}
                </span>

                {/* HOVER TOOLTIP (Shows Detailed Activity) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[200px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 translate-y-2 group-hover:translate-y-0">
                  <div className="bg-popover border border-border text-popover-foreground text-left p-3 rounded-xl shadow-xl flex flex-col gap-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 border-b border-border/50 pb-1">
                      {MONTHS[selectedMonth]} {data.day}, {selectedYear}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {data.creations} Creations
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {data.changes} Changes
                    </div>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover border-b border-r border-border rotate-45" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-[9px] font-bold uppercase text-muted-foreground pt-4 border-t border-border/50">
        <span>Less Activity</span>
        <div className="flex gap-1.5 mx-1">
          <div className="w-3 h-3 rounded-sm bg-muted/20 border border-border/50" />
          <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" />
          <div className="w-3 h-3 rounded-sm bg-primary/60 border border-primary/70" />
          <div className="w-3 h-3 rounded-sm bg-primary border border-primary" />
        </div>
        <span>More Activity</span>
      </div>
    </div>
  );
}
