import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { useAppStore } from "../../store/use-appstore";

export default function ProcessingOverlay() {
  const { isProcessing, statusMessage } = useAppStore();

  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center"
        >
          <RefreshCcw className="animate-spin text-purple-500 mb-6" size={64} />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            Engine Busy
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
            {statusMessage}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
