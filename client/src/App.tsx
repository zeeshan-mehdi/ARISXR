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

  const handleEnterXR = async (mode: 'ar' | 'vr') => {
    try {
      console.log(`Entering XR mode: ${mode} with hand tracking enabled...`);
      const session = mode === 'ar' 
        ? await xrStore.enterAR()
        : await xrStore.enterVR();
      console.log('XR session started:', session);
      setIsInXR(true);
    } catch (error) {
      console.error('Failed to enter XR:', error);
      const device = mode === 'ar' ? 'Meta Quest 3' : 'Apple Vision Pro';
      alert(`Failed to enter ${mode === 'ar' ? 'Mixed Reality' : 'Virtual Reality'}. Make sure you are using a compatible browser on your ${device}.`);
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
              <VoiceAssistant isXR={false} />
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
