import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export const log = (msg: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `%c[DEBUG ${timestamp}] ${msg}`,
    "color: #a855f7; font-weight: bold",
    data || ""
  );
};

export const runSidecarJob = async (
  kind: string,
  source?: string | null,
  path?: string | null,
  aeVersion?: string | null,
  version?: number | null
) => {
  log(`Dispatching Job: ${kind}`, { source, path, aeVersion, version });
  try {
    const rawResponse = await invoke<string>("dispatch_sidecar_job", {
      kind,
      source: source || null,
      path: path || null,
      aeVersion: aeVersion,
      version: version || null,
    });

    const res = JSON.parse(rawResponse);
    log(`Sidecar Response for ${kind}:`, res);

    if (!res.success) {
      const errMsg = res.error?.message || res.message || "Unknown Engine Error";
      log(`Sidecar Failure: ${errMsg}`);
      throw new Error(errMsg);
    }

    return res.data === null ? true : res.data;
  } catch (err: any) {
    log(`Execution Error in ${kind}:`, err);
    if (
      err.message?.toLowerCase().includes("permission") ||
      err.message?.toLowerCase().includes("access")
    ) {
      toast.error("ADMIN REQUIRED: Restart app as Administrator");
    } else {
      toast.error(err.message || "Operation failed");
    }
    return null;
  }
};
