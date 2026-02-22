import { History, Trash2, XCircle } from "lucide-react";

interface AssetItemProps {
  plugin: any;
  selectedVersion: number;
  onVersionChange: (path: string, v: number) => void;
  onAction: (kind: string, args: any) => void;
}

export default function AssetItem({
  plugin,
  selectedVersion,
  onVersionChange,
  onAction,
}: AssetItemProps) {
  return (
    <div className="flex flex-col bg-black/40 border border-zinc-800/50 rounded-xl p-3 group/item space-y-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold truncate pr-2 text-zinc-300">
            {plugin.fileName}
          </p>
          <p className="text-[8px] text-zinc-700 font-black uppercase">
            AE {plugin.aeVersion} • v{plugin.currentVersion}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
          <button
            onClick={() => onAction("revert", { path: plugin.installPath, version: selectedVersion })}
            className="p-1.5 text-zinc-600 hover:text-blue-400"
            title="Revert to selected version"
          >
            <History size={13} />
          </button>
          <button
            onClick={() => onAction("delete", { path: plugin.installPath })}
            className="p-1.5 text-zinc-600 hover:text-red-400"
            title="Delete current file"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => onAction("deleteAll", { path: plugin.installPath })}
            className="p-1.5 text-zinc-600 hover:text-red-600"
            title="Delete everything"
          >
            <XCircle size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/30">
        <span className="text-[8px] font-black text-zinc-600 uppercase">
          Version History
        </span>
        <select
          value={selectedVersion}
          onChange={(e) => onVersionChange(plugin.installPath, parseInt(e.target.value))}
          className="bg-transparent text-[10px] font-black text-purple-400 outline-none cursor-pointer"
        >
          {Array.from({ length: plugin.currentVersion }, (_, i) => i + 1)
            .reverse()
            .map((v) => (
              <option key={v} value={v} className="bg-zinc-900 text-white">
                Version {v} {v === plugin.currentVersion ? "(Latest)" : ""}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
