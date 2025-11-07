import { Canvas } from "@react-three/fiber";
import { Grid, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import { BPMNWorld } from "./BPMNWorld";
import { CameraTracker } from "./CameraTracker";
import { FuturisticWorld } from "./FuturisticWorld";
import type { XRSessionType } from "../lib/stores/useGame";

interface BPMNSceneXRProps {
  wsRef: React.RefObject<WebSocket | null>;
  xrStore: ReturnType<typeof createXRStore>;
  isInXR: boolean;
  xrSessionType: XRSessionType;
}

export function BPMNSceneXR({ wsRef, xrStore, isInXR, xrSessionType }: BPMNSceneXRProps) {
  console.log('[BPMNSceneXR] Rendering - isInXR:', isInXR, 'xrSessionType:', xrSessionType);
  
  const isARMode = xrSessionType === 'ar';
  const isVRMode = xrSessionType === 'vr';
  const isDesktopMode = !isInXR;
  
  return (
    <Canvas
      shadows
      gl={{
        alpha: true,
        antialias: true,
      }}
      style={{
        background: isARMode ? "transparent" : undefined,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    >
      <XR store={xrStore}>
        {/* Desktop Mode: Dark background */}
        {isDesktopMode && <color attach="background" args={["#1a1a2e"]} />}
        
        {/* AR Mode: Transparent background for passthrough */}
        {/* VR Mode: Handled by FuturisticWorld skybox */}

        <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={60} />

        {/* Desktop Mode: Orbit controls */}
        {isDesktopMode && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />
        )}

        {/* Desktop Mode: Grid */}
        {isDesktopMode && (
          <Grid
            args={[100, 100]}
            cellSize={2}
            cellThickness={0.5}
            cellColor="#6366f1"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#8b5cf6"
            fadeDistance={50}
            fadeStrength={1}
            position={[0, -0.01, 0]}
          />
        )}

        {/* AR Mode: Minimal ground plane */}
        {isARMode && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -5]}>
            <planeGeometry args={[30, 30]} />
            <meshBasicMaterial color="#1a1a2e" opacity={0.3} transparent />
          </mesh>
        )}
        
        {/* VR Mode: Futuristic World Environment */}
        {isVRMode && <FuturisticWorld />}

        <BPMNWorld wsRef={wsRef} isXR={isInXR} xrSessionType={xrSessionType} />

        {isDesktopMode && <CameraTracker wsRef={wsRef} />}
      </XR>
    </Canvas>
  );
}
