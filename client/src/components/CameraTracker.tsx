import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useBPMN } from "../lib/stores/useBPMN";

interface CameraTrackerProps {
  wsRef: React.RefObject<WebSocket | null>;
}

export function CameraTracker({ wsRef }: CameraTrackerProps) {
  const { camera } = useThree();
  const { currentUserId } = useBPMN();
  const lastPositionRef = useRef<[number, number, number]>([0, 0, 0]);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sendPosition = () => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !currentUserId) {
        return;
      }

      const position: [number, number, number] = [
        Math.round(camera.position.x * 10) / 10,
        Math.round(camera.position.y * 10) / 10,
        Math.round(camera.position.z * 10) / 10,
      ];

      const [lastX, lastY, lastZ] = lastPositionRef.current;
      const [x, y, z] = position;

      if (Math.abs(x - lastX) > 0.5 || Math.abs(y - lastY) > 0.5 || Math.abs(z - lastZ) > 0.5) {
        lastPositionRef.current = position;
        
        wsRef.current.send(JSON.stringify({
          type: 'position',
          position,
        }));
      }
    };

    const interval = setInterval(sendPosition, 500);

    return () => {
      clearInterval(interval);
    };
  }, [camera, wsRef, currentUserId]);

  return null;
}
