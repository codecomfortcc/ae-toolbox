import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

const Test = () => {
  useEffect(() => {
  const unlisten = listen<string[]>("tauri://file-drop", (event) => {
    console.log("TAURI FILE DROP:", event.payload);
  });

  return () => {
    unlisten.then(f => f());
  };
}, []);
  return (
    <div style={{ height: "400px", border: "2px dashed red" }}>
      DROP HERE (native test)
    </div>
  );
};

export default Test;
