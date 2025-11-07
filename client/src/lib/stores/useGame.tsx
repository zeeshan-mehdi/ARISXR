import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";
export type XRSessionType = "ar" | "vr" | null;
export type XRModePreference = "ar" | "vr";

interface GameState {
  phase: GamePhase;
  xrSessionType: XRSessionType;
  xrModePreference: XRModePreference;
  supportsAR: boolean;
  supportsVR: boolean;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  setXRSessionType: (type: XRSessionType) => void;
  setXRModePreference: (mode: XRModePreference) => void;
  setXRSupport: (ar: boolean, vr: boolean) => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "ready",
    xrSessionType: null,
    xrModePreference: "ar",
    supportsAR: false,
    supportsVR: false,
    
    start: () => {
      set((state) => {
        // Only transition from ready to playing
        if (state.phase === "ready") {
          return { phase: "playing" };
        }
        return {};
      });
    },
    
    restart: () => {
      set(() => ({ phase: "ready" }));
    },
    
    end: () => {
      set((state) => {
        // Only transition from playing to ended
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    },
    
    setXRSessionType: (type) => {
      console.log('[useGame] Setting XR session type:', type);
      set({ xrSessionType: type });
    },
    
    setXRModePreference: (mode) => {
      console.log('[useGame] Setting XR mode preference:', mode);
      set({ xrModePreference: mode });
    },
    
    setXRSupport: (ar, vr) => {
      console.log('[useGame] Setting XR support - AR:', ar, 'VR:', vr);
      set({ supportsAR: ar, supportsVR: vr });
    }
  }))
);
