import "@fontsource/inter";
import { useState, useMemo, useEffect, useRef } from "react";
import { LandingPage } from "./components/LandingPage";
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
  const [showLanding, setShowLanding] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isInXR, setIsInXR] = useState(false);
  const [autoXRAttempted, setAutoXRAttempted] = useState(false);
  const xrAttemptedRef = useRef(false);
  
  const xrStore = useMemo(() => createXRStore({
    hand: {
      left: true,
      right: true,
      rayPointer: {
        rayModel: { color: 'cyan' }
      }
    }
  }), []);

  const handleEnterFromLanding = () => {
    setShowLanding(false);
    setShowLibrary(true);
  };

  const handleBackToLibrary = () => {
    setProcess(null);
    setShowLibrary(true);
    setAutoXRAttempted(false);
    xrAttemptedRef.current = false;
  };

  const handleEnterXR = async (mode: 'ar' | 'vr', silent = false) => {
    try {
      console.log(`[App] Entering XR mode: ${mode} with hand tracking enabled...`);
      const session = mode === 'ar'
        ? await xrStore.enterAR()
        : await xrStore.enterVR();
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

  // Auto-enter XR mode when a process is loaded
  useEffect(() => {
    const autoEnterXR = async () => {
      if (!process || xrAttemptedRef.current) {
        return;
      }

      console.log('[App] Process loaded, attempting auto-enter XR...');
      xrAttemptedRef.current = true;

      if ('xr' in navigator && navigator.xr) {
        try {
          // Check AR support first (Meta Quest 3)
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
          console.log('[App] AR supported:', arSupported);

          if (arSupported) {
            console.log('[App] Auto-entering AR mode...');
            const success = await handleEnterXR('ar', true);
            setAutoXRAttempted(true);
            if (success) {
              console.log('[App] Successfully auto-entered AR mode');
            } else {
              console.log('[App] Auto-enter AR failed, staying in desktop mode');
            }
            return;
          }

          // Check VR support (Apple Vision Pro)
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
          console.log('[App] VR supported:', vrSupported);

          if (vrSupported) {
            console.log('[App] Auto-entering VR mode...');
            const success = await handleEnterXR('vr', true);
            setAutoXRAttempted(true);
            if (success) {
              console.log('[App] Successfully auto-entered VR mode');
            } else {
              console.log('[App] Auto-enter VR failed, staying in desktop mode');
            }
            return;
          }

          console.log('[App] No XR support detected, staying in desktop mode');
          setAutoXRAttempted(true);
        } catch (error) {
          console.error('[App] Auto-enter XR failed:', error);
          setAutoXRAttempted(true);
        }
      } else {
        console.log('[App] navigator.xr not available, staying in desktop mode');
        setAutoXRAttempted(true);
      }
    };

    autoEnterXR();
  }, [process]);

  xrStore.subscribe((state) => {
    setIsInXR(state !== null);
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: showLibrary ? 'auto' : 'hidden' }}>
      {showLanding && (
        <LandingPage onEnter={handleEnterFromLanding} />
      )}
      {!showLanding && !process && showLibrary && (
        <ProcessLibrary onProcessSelected={() => setShowLibrary(false)} />
      )}
      {!showLanding && !process && !showLibrary && <UploadPanel />}
      {!showLanding && process && (
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
