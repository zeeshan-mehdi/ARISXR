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
  const { process, setProcess } = useBPMN();
  const [showLibrary, setShowLibrary] = useState(true);

  const handleBackToLibrary = () => {
    setProcess(null);
    setShowLibrary(true);
  };

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
          <button
            onClick={handleBackToLibrary}
            className="absolute top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 flex items-center gap-2 transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Library
          </button>
        </>
      )}
    </div>
  );
}

export default App;
