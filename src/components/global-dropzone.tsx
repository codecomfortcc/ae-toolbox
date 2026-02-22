import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalDropZone({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleGlobalDrop, setDragging, isDraggingGlobal } = useProjectStore();
  const [, setDragCounter] = useState(0);

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => {
        if (prev === 0) setDragging(true);
        return prev + 1;
      });
    },
    [setDragging],
  );

  const onDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => {
        const newCount = prev - 1;
        if (newCount === 0) setDragging(false);
        return newCount;
      });
    },
    [setDragging],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      setDragCounter(0);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleGlobalDrop(Array.from(e.dataTransfer.files));
      }
    },
    [handleGlobalDrop, setDragging],
  );

  return (
    <div
      className="relative w-full h-full"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(e) => e.preventDefault()} // Critical to allow dropping
      onDrop={onDrop}
    >
      {children}

      {/* Visual Overlay */}
      <AnimatePresence>
        {isDraggingGlobal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-card border-2 border-dashed border-primary rounded-3xl p-12 text-center shadow-2xl"
            >
              <UploadCloud
                size={64}
                className="mx-auto text-primary mb-6 animate-bounce"
              />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
                Release to Ingest
              </h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-2">
                Auto-sorting via Instinct Rules
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
