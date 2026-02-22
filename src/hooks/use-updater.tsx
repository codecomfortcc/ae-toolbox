import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useAppStore } from '../store/use-appstore';
import { toast } from 'sonner';

export const useAutoUpdate = () => {
  const { setProcessing } = useAppStore();

  const checkForUpdates = async (silent = false) => {
    try {
      if (!silent) setProcessing(true, "Checking for Updates...");

      // 1. Check GitHub for a new version
      const update = await check();

      if (update?.available) {
        setProcessing(false); // Hide spinner to show dialog
        
        // 2. Ask User Permission
        const yes = await confirm(`
          Update v${update.version} available!
          
          Release Notes:
          ${update.body || "Security improvements and bug fixes."}
          
          Install now?
        `);

        if (yes) {
          // 3. Download & Verify Signature (handled by Rust)
          setProcessing(true, "Downloading & Verifying Signature...");
          await update.downloadAndInstall();
          
          // 4. Restart the App
          setProcessing(true, "Restarting...");
          await relaunch();
        }
      } else if (!silent) {
        toast.success("You are on the latest version.");
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      if (!silent) toast.error(`Update Error: ${error.message || "Unknown error"}`);
    } finally {
      setProcessing(false);
    }
  };

  return { checkForUpdates };
};
