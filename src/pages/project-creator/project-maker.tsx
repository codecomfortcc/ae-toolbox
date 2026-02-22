// React hooks are managed largely by Zustand store in this view, some local state if needed can be added here.
import { useProjectStore } from "@/store/project-store";
import ProjectTopBar from "./components/project-top-bar";
import ProjectFooter from "./components/bottom-footer";
import PropertiesPanel from "./components/properties-panel";
import SmartGridView from "./components/views/project-grid-view";
import ResizeableListView from "./components/views/project-list-view";
import ProjectContextMenu from "./components/project-context-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ProjectEditor() {
  const { viewMode, files, currentPath, propertiesPanelOpen } =
    useProjectStore();

  const parentId = currentPath[currentPath.length - 1].id;
  const currentFiles = files[parentId] || [];

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      <ProjectTopBar />

      <div className="flex-1 flex overflow-hidden relative">
        {/* --- RIGHT SIDEBAR --- */}
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel>
            <ProjectContextMenu>
              <main className="flex-1 h-full w-full relative bg-background/50">
                {/* Noise Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

                {viewMode === "grid" ? (
                  <SmartGridView files={currentFiles} />
                ) : (
                  <ResizeableListView files={currentFiles} />
                )}

                {currentFiles.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="text-center">
                      <h2 className="text-4xl font-black uppercase">Empty</h2>
                      <p className="font-mono mt-2">Ctrl+N to create folder</p>
                    </div>
                  </div>
                )}
              </main>
            </ProjectContextMenu>
          </ResizablePanel>
          <ResizableHandle />
          {propertiesPanelOpen && (
            <ResizablePanel>
              <aside className=" border-l border-border bg-card/50 backdrop-blur-md z-10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                <PropertiesPanel />
              </aside>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
      <ProjectFooter />
    </div>
  );
}
