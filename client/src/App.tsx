import "@fontsource/inter";
import { useState, useMemo } from "react";
import { BPMNSceneXR } from "./components/BPMNSceneXR";
import { ProcessLibrary } from "./components/ProcessLibrary";
import { UploadPanel } from "./components/ui/UploadPanel";
import { InfoPanel } from "./components/ui/InfoPanel";
import { XRButton } from "./components/XRButton";
import { XRInstructions } from "./components/XRInstructions";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { useWebSocket } from "./hooks/useWebSocket";
import { useBPMN } from "./lib/stores/useBPMN";
import { createXRStore } from "@react-three/xr";

function App() {
  const wsRef = useWebSocket();
  const { process, setProcess } = useBPMN();
  const [showLibrary, setShowLibrary] = useState(true);
  const [isInXR, setIsInXR] = useState(false);
  
  const xrStore = useMemo(() => createXRStore({
    hand: {
      left: true,
      right: true,
      rayPointer: {
        rayModel: { color: 'cyan' }
      }
    }
  }), []);

  const handleBackToLibrary = () => {
    setProcess(null);
    setShowLibrary(true);
  };

  const handleEnterXR = async () => {
    try {
      console.log('Entering XR with hand tracking enabled...');
      const session = await xrStore.enterAR();
      console.log('XR session started:', session);
      setIsInXR(true);
    } catch (error) {
      console.error('Failed to enter XR:', error);
      alert('Failed to enter Mixed Reality. Make sure you are using a compatible browser on your Meta Quest 3.');
    }
  };

  xrStore.subscribe((state) => {
    setIsInXR(state !== null);
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {!process && showLibrary && (
        <ProcessLibrary onProcessSelected={() => setShowLibrary(false)} />
      )}
      {!process && !showLibrary && <UploadPanel />}
      {process && (
        <>
          <BPMNSceneXR wsRef={wsRef} xrStore={xrStore} isInXR={isInXR} />
          {!isInXR && (
            <>
              <InfoPanel />
              <UploadPanel />
              <XRInstructions />
              {/* Move VoiceAssistant to the right side */}
              <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 50 }}>
                <VoiceAssistant isXR={false} />
              </div>
              {/* <VoiceAssistant isXR={isInXR} /> */}
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
          <XRButton onEnterXR={handleEnterXR} isInXR={isInXR} />
        </>
      )}
    </div>
  );
}

export default App;
