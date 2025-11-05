import "@fontsource/inter";
import { BPMNScene } from "./components/BPMNScene";
import { UploadPanel } from "./components/ui/UploadPanel";
import { InfoPanel } from "./components/ui/InfoPanel";
import { useWebSocket } from "./hooks/useWebSocket";
import { useBPMN } from "./lib/stores/useBPMN";

function App() {
  const wsRef = useWebSocket();
  const { process } = useBPMN();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {!process && <UploadPanel />}
      {process && (
        <>
          <BPMNScene wsRef={wsRef} />
          <InfoPanel />
        </>
      )}
    </div>
  );
}

export default App;
