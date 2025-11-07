import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";
export type XRSessionType = "ar" | "vr" | null;

interface GameState {
  phase: GamePhase;
  xrSessionType: XRSessionType;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  setXRSessionType: (type: XRSessionType) => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "ready",
    xrSessionType: null,
    
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
    }
  }))
);
