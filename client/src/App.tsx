import "@fontsource/inter";
import { useState, useMemo, useEffect, useRef } from "react";
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
  const lastProcessIdRef = useRef<string | null>(null);
  
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
    lastProcessIdRef.current = null;
  };

  const handleEnterXR = async (mode: 'ar' | 'vr', silent = false) => {
    try {
      console.log(`[App] Entering XR mode: ${mode} with hand tracking enabled...`);
      
      const sessionInit = {
        optionalFeatures: ['hand-tracking', 'local-floor', 'bounded-floor'],
        requiredFeatures: [] as string[]
      };
      
      console.log('[App] Session init options:', sessionInit);
      
      const session = mode === 'ar' 
        ? await (xrStore.enterAR as any)(sessionInit)
        : await (xrStore.enterVR as any)(sessionInit);
      
      console.log('[App] XR session started:', session);
      setIsInXR(true);
      return true;
    } catch (error) {
      console.error('[App] Failed to enter XR:', error);
      if (!silent) {
        const device = mode === 'ar' ? 'Meta Quest 3' : 'Apple Vision Pro';
        alert(`Failed to enter ${mode === 'ar' ? 'Mixed Reality' : 'Virtual Reality'}. Make sure you are using a compatible browser on your ${device}.`);
      }
      return false;
    }
  };

  // Subscribe to XR state changes
  useEffect(() => {
    const unsubscribe = xrStore.subscribe((state) => {
      console.log('[App] XR state changed:', state !== null ? 'In XR' : 'Desktop');
      setIsInXR(state !== null);
    });
    return unsubscribe;
  }, [xrStore]);

  // Log process changes
  useEffect(() => {
    const processId = process?.id || null;
    console.log('[App] Process changed - processId:', processId);
  }, [process]);

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
        </>
      )}
      
      {/* XR Button - always show when not in XR (before or after process load) */}
      <XRButton onEnterXR={handleEnterXR} isInXR={isInXR} />
    </div>
  );
}

export default App;
