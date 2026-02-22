import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, ChevronRight, Folder, FileCheck } from "lucide-react";

interface FolderModalProps {
  show: boolean;
  onClose: () => void;
  currentPathStack: string[];
  setCurrentPathStack: (path: string[]) => void;
  foldersAtCurrentLevel: string[];
  newSubFolderName: string;
  setNewSubFolderName: (name: string) => void;
  onFinalize: () => void;
}

export default function FolderModal({
  show,
  onClose,
  currentPathStack,
  setCurrentPathStack,
  foldersAtCurrentLevel,
  newSubFolderName,
  setNewSubFolderName,
  onFinalize,
}: FolderModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-150 bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-zinc-600 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black uppercase italic flex items-center gap-3 mb-6 text-white">
              <FolderPlus className="text-purple-500" size={24} /> Set Destination
            </h2>

            <div className="flex items-center gap-2 mb-4 overflow-x-auto py-2 scrollbar-hide">
              <button
                onClick={() => setCurrentPathStack([])}
                className="text-[9px] font-black uppercase text-purple-400"
              >
                ROOT
              </button>
              {currentPathStack.map((name, i) => (
                <div key={i} className="flex items-center gap-1">
                  <ChevronRight size={10} className="text-zinc-700" />
                  <span className="text-[9px] font-black uppercase text-zinc-300">
                    {name}
                  </span>
                </div>
              ))}
            </div>

            <div className="max-h-60 overflow-y-auto mb-8 bg-black/40 rounded-3xl border border-zinc-800 p-2 custom-scrollbar">
              {foldersAtCurrentLevel.map((f) => (
                <button
                  key={f}
                  onClick={() => setCurrentPathStack([...currentPathStack, f])}
                  className="w-full text-left p-4 text-[11px] border-b border-zinc-800/20 hover:bg-purple-500/10 rounded-2xl flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Folder
                      size={14}
                      className="text-zinc-700 group-hover:text-purple-500 transition-colors"
                    />
                    <span className="font-bold text-zinc-500 group-hover:text-zinc-200 uppercase">
                      {f}
                    </span>
                  </div>
                  <ChevronRight size={12} className="text-zinc-800" />
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="SUBFOLDER..."
              value={newSubFolderName}
              onChange={(e) => setNewSubFolderName(e.target.value.toUpperCase())}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-[10px] outline-none focus:border-purple-500 font-black tracking-widest mb-4 text-white"
            />
            <button
              onClick={onFinalize}
              className="w-full bg-purple-600 py-5 rounded-2xl text-[10px] text-white font-black uppercase flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 hover:bg-purple-500 transition-colors"
            >
              <FileCheck size={14} /> Finalize Installation
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
