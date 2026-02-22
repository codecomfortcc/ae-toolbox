import { useMemo } from "react";
import { useProjectStore, FileNode } from "@/store/project-store";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { FileIcon, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<FileNode>();

export default function ResizeableListView({ files }: { files: FileNode[] }) {
  const { visibleColumns, toggleSelection, selectedFileIds, navigateDown } =
    useProjectStore();

  // Dynamically generate columns based on store
  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("name", {
          header: "Name",
          size: 300,
          cell: (info: any) => {
            const file = info.row.original;
            return (
              <div className="flex items-center gap-3 pl-2">
                {file.type === "folder" ? (
                  <Folder size={16} className="text-primary fill-primary/20" />
                ) : (
                  <FileIcon size={16} className="text-muted-foreground" />
                )}
                <span className="font-bold truncate">{file.name}</span>
              </div>
            );
          },
        }),
        columnHelper.accessor("type", { header: "Type", size: 80 }),
        columnHelper.accessor("size", { header: "Size", size: 80 }),
        columnHelper.accessor("fps", { header: "FPS", size: 60 }),
        columnHelper.accessor("duration", { header: "Duration", size: 80 }),
        columnHelper.accessor("dateModified", {
          header: "Date Modified",
          size: 120,
        }),
      ].filter(
        (col) =>
          col.id === "name" ||
          visibleColumns[col.id! as string]?.visible !== false,
      ),
    [visibleColumns],
  );

  const table = useReactTable({
    data: files,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar">
      <table
        className="w-full text-left border-collapse"
        style={{ width: table.getTotalSize() }}
      >
        <thead className="sticky top-0 bg-card z-10 shadow-sm">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="relative px-4 py-3 text-[10px] uppercase font-black text-muted-foreground select-none group border-b border-border"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {/* Resizer Handle */}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={cn(
                      "absolute right-0 top-2 bottom-2 w-1 rounded-full cursor-col-resize hover:bg-primary transition-colors",
                      header.column.getIsResizing()
                        ? "bg-primary"
                        : "bg-border/50",
                    )}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row: any) => {
            const isSelected = selectedFileIds.includes(row.original.id);
            return (
              <tr
                key={row.id}
                onClick={(e) => toggleSelection(row.original.id, e.ctrlKey)}
                onDoubleClick={() =>
                  row.original.type === "folder" &&
                  navigateDown(row.original.id, row.original.name)
                }
                className={cn(
                  "border-b border-border/40 text-xs cursor-pointer transition-colors",
                  isSelected
                    ? "bg-primary/20 text-foreground"
                    : "hover:bg-accent/50 text-muted-foreground",
                )}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} className="px-4 py-2 truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
