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
import { useGame } from "./lib/stores/useGame";
import { createXRStore } from "@react-three/xr";

function App() {
  const wsRef = useWebSocket();
  const { process, setProcess } = useBPMN();
  const { xrSessionType, setXRSessionType, xrModePreference, setXRModePreference, supportsAR, supportsVR } = useGame();
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
      setXRSessionType(mode);
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

  const handleToggleXRMode = async () => {
    console.log('[App] Toggling XR mode - current:', xrSessionType);
    
    try {
      // Determine new mode
      const newMode: 'ar' | 'vr' = xrSessionType === 'ar' ? 'vr' : 'ar';
      console.log('[App] Switching to mode:', newMode);
      
      // Update preference first
      setXRModePreference(newMode);
      
      // Get current XR state
      const currentState = xrStore.getState();
      if (currentState?.session) {
        console.log('[App] Ending current XR session...');
        
        // Wait for session to fully end
        await new Promise<void>((resolve) => {
          const session = currentState.session;
          if (!session) {
            resolve();
            return;
          }
          
          // Listen for session end event
          const onEnd = () => {
            console.log('[App] Session end event fired');
            resolve();
          };
          
          session.addEventListener('end', onEnd, { once: true });
          
          // Also check store state changes as fallback
          const unsubscribe = xrStore.subscribe((state) => {
            if (!state.session) {
              console.log('[App] Session cleared from store');
              unsubscribe();
              resolve();
            }
          });
          
          // Initiate session end
          session.end().catch((err) => {
            console.warn('[App] Session end error:', err);
            resolve(); // Continue anyway
          });
        });
        
        console.log('[App] Session fully ended, waiting for cleanup...');
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Re-enter XR with new mode
      console.log('[App] Re-entering XR with mode:', newMode);
      await handleEnterXR(newMode, true);
    } catch (error) {
      console.error('[App] Error toggling XR mode:', error);
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

      // Wait for capabilities to be detected (give XRButton time to run)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use stored capabilities if available
      if (supportsAR || supportsVR) {
        console.log('[App] Using stored capabilities - AR:', supportsAR, 'VR:', supportsVR);
        
        if (supportsAR && supportsVR) {
          // Both supported (Quest 3) - use preference
          console.log('[App] Both AR and VR supported - using preference:', xrModePreference);
          const success = await handleEnterXR(xrModePreference, true);
          setAutoXRAttempted(true);
          if (success) {
            console.log(`[App] Successfully auto-entered ${xrModePreference.toUpperCase()} mode`);
          }
          return;
        } else if (supportsAR) {
          console.log('[App] Auto-entering AR mode (only mode supported)');
          const success = await handleEnterXR('ar', true);
          setAutoXRAttempted(true);
          if (success) {
            console.log('[App] Successfully auto-entered AR mode');
          }
          return;
        } else if (supportsVR) {
          console.log('[App] Auto-entering VR mode (only mode supported)');
          const success = await handleEnterXR('vr', true);
          setAutoXRAttempted(true);
          if (success) {
            console.log('[App] Successfully auto-entered VR mode');
          }
          return;
        }
      }

      // Fallback: check manually if capabilities not yet stored
      if ('xr' in navigator && navigator.xr) {
        try {
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
          console.log('[App] Manual check - AR:', arSupported, 'VR:', vrSupported);

          if (arSupported && vrSupported) {
            // Both supported - use preference
            console.log('[App] Both modes supported - using preference:', xrModePreference);
            const success = await handleEnterXR(xrModePreference, true);
            setAutoXRAttempted(true);
            if (success) {
              console.log(`[App] Successfully auto-entered ${xrModePreference.toUpperCase()} mode`);
            }
          } else if (arSupported) {
            const success = await handleEnterXR('ar', true);
            setAutoXRAttempted(true);
            if (success) {
              console.log('[App] Successfully auto-entered AR mode');
            }
          } else if (vrSupported) {
            const success = await handleEnterXR('vr', true);
            setAutoXRAttempted(true);
            if (success) {
              console.log('[App] Successfully auto-entered VR mode');
            }
          } else {
            console.log('[App] No XR support detected');
            setAutoXRAttempted(true);
          }
        } catch (error) {
          console.error('[App] Auto-enter XR failed:', error);
          setAutoXRAttempted(true);
        }
      } else {
        console.log('[App] navigator.xr not available');
        setAutoXRAttempted(true);
      }
    };

    autoEnterXR();
  }, [process, supportsAR, supportsVR, xrModePreference]);

  // Subscribe to XR store to track session state
  useEffect(() => {
    const unsubscribe = xrStore.subscribe((state) => {
      const inXR = state !== null;
      setIsInXR(inXR);
      
      // Clear session type when exiting XR
      if (!inXR) {
        console.log('[App] Exited XR, clearing session type');
        setXRSessionType(null);
      }
    });
    
    return unsubscribe;
  }, [xrStore, setXRSessionType]);

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
          <BPMNSceneXR 
            wsRef={wsRef} 
            xrStore={xrStore} 
            isInXR={isInXR} 
            xrSessionType={xrSessionType}
            onToggleXRMode={handleToggleXRMode}
          />
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
