import { useMemo } from "react";
import * as THREE from "three";
import type { BPMNElement } from "../lib/bpmnParser";
import type { LayoutNode } from "../lib/bpmnLayout";

interface FlowConnectionProps {
  flow: BPMNElement;
  sourceNode: LayoutNode | undefined;
  targetNode: LayoutNode | undefined;
}

export function FlowConnection({ flow, sourceNode, targetNode }: FlowConnectionProps) {
  const { points, direction, arrowPosition } = useMemo(() => {
    if (!sourceNode || !targetNode) {
      return { points: [], direction: new THREE.Vector3(), arrowPosition: new THREE.Vector3() };
    }
    
    const start = new THREE.Vector3(...sourceNode.position);
    const end = new THREE.Vector3(...targetNode.position);
    
    const midX = (start.x + end.x) / 2;
    const mid1 = new THREE.Vector3(midX, start.y, start.z);
    const mid2 = new THREE.Vector3(midX, end.y, end.z);
    
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    const arrowPosition = end.clone().sub(direction.clone().multiplyScalar(0.15));
    
    return { 
      points: [start, mid1, mid2, end],
      direction,
      arrowPosition
    };
  }, [sourceNode, targetNode]);

  if (points.length === 0 || !sourceNode || !targetNode) return null;

  return (
    <>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#66CCFF" />
      </line>
      
      <arrowHelper
        args={[
          direction,
          arrowPosition,
          0.15,
          0x66CCFF,
          0.1,
          0.07,
        ]}
      />
    </>
  );
}
