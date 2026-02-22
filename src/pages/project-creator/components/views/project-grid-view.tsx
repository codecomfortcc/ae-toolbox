import { useMemo } from "react";
import { Grid } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { useProjectStore, FileNode } from "@/store/project-store";
import ProjectExplorerContextMenu from "../project-context-menu";

export default function SmartGridView({ files }: { files: FileNode[] }) {
  const { toggleSelection, selectedFileIds, navigateDown, setContextTarget } =
    useProjectStore();

  const memoFiles = useMemo(() => files, [files]);

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
    columnCount,
    memoFiles,
    selectedFileIds,
    toggleSelection,
    navigateDown,
    setContextTarget,
  }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    const file = memoFiles[index];
    if (!file) return null;

    const selected = selectedFileIds.includes(file.id);

    return (
      <div style={{ ...style, padding: 12 }}>
        <div
          data-file-item
          className={`h-full rounded-xl p-4 cursor-pointer transition-all ${
            selected
              ? "ring-2 ring-primary bg-primary/20"
              : "hover:bg-accent/40"
          }`}
          onClick={(e) =>
            toggleSelection(file.id, e.ctrlKey || e.shiftKey || e.metaKey)
          }
          onDoubleClick={() =>
            file.type === "folder" && navigateDown(file.id, file.name)
          }
          onContextMenu={() => {
            setContextTarget({
              type: "file",
              fileId: file.id,
            });
          }}
        >
          <div className="text-sm font-medium truncate">{file.name}</div>
        </div>
      </div>
    );
  };

  return (
    <ProjectExplorerContextMenu>
      <div
        className="absolute inset-0"
        onContextMenu={(e) => {
          const isFile = (e.target as HTMLElement).closest("[data-file-item]");
          if (!isFile) {
            setContextTarget({
              type: "project",
            });
          }
        }}
      >
        <AutoSizer
          renderProp={({ height, width }) => {
            if (!height || !width) return null;

            const columnWidth = 180;
            const rowHeight = 120;
            const columnCount = Math.floor(width / columnWidth) || 1;
            const rowCount = Math.ceil(memoFiles.length / columnCount);

            return (
              <Grid
                style={{ height, width }}
                columnCount={columnCount}
                columnWidth={width / columnCount}
                rowCount={rowCount}
                rowHeight={rowHeight}
                cellComponent={Cell}
                cellProps={{
                  columnCount,
                  memoFiles,
                  selectedFileIds,
                  toggleSelection,
                  navigateDown,
                  setContextTarget,
                }}
              />
            );
          }}
        />
      </div>
    </ProjectExplorerContextMenu>
  );
}
