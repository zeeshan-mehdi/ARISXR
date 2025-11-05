import "@fontsource/inter";
import { useState } from "react";
import { BPMNScene } from "./components/BPMNScene";
import { ProcessLibrary } from "./components/ProcessLibrary";
import { UploadPanel } from "./components/ui/UploadPanel";
import { InfoPanel } from "./components/ui/InfoPanel";
import { useWebSocket } from "./hooks/useWebSocket";
import { useBPMN } from "./lib/stores/useBPMN";

function App() {
  const wsRef = useWebSocket();
  const { process } = useBPMN();
  const [showLibrary, setShowLibrary] = useState(true);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {!process && showLibrary && (
        <ProcessLibrary onProcessSelected={() => setShowLibrary(false)} />
      )}
      {!process && !showLibrary && <UploadPanel />}
      {process && (
        <>
          <BPMNScene wsRef={wsRef} />
          <InfoPanel />
          <UploadPanel />
        </>
      )}
    </div>
  );
}

export default App;
