import { Canvas } from "@react-three/fiber";
import { Grid, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import { BPMNWorld } from "./BPMNWorld";
import { CameraTracker } from "./CameraTracker";

interface BPMNSceneXRProps {
  wsRef: React.RefObject<WebSocket | null>;
  xrStore: ReturnType<typeof createXRStore>;
  isInXR: boolean;
}

export function BPMNSceneXR({ wsRef, xrStore, isInXR }: BPMNSceneXRProps) {
  return (
    <Canvas
      shadows
      gl={{
        alpha: true,
        antialias: true,
      }}
      style={{
        background: isInXR ? "transparent" : undefined,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    >
      <XR store={xrStore}>
        {isInXR ? null : <color attach="background" args={["#1a1a2e"]} />}

        <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={60} />

        {!isInXR && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />
        )}

        {!isInXR && (
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

        {isInXR && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -5]}>
            <planeGeometry args={[30, 30]} />
            <meshBasicMaterial color="#1a1a2e" opacity={0.3} transparent />
          </mesh>
        )}

        <BPMNWorld wsRef={wsRef} isXR={isInXR} />

        {!isInXR && <CameraTracker wsRef={wsRef} />}
      </XR>
    </Canvas>
  );
}
