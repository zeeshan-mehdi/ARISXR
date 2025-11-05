import { Text } from '@react-three/drei';
import { Suspense } from 'react';
import type { BPMNElement } from '../lib/bpmnParser';
import * as THREE from 'three';

interface XRInfoPanelProps {
  element: BPMNElement;
}

export function XRInfoPanel({ element }: XRInfoPanelProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'startEvent': 'Start',
      'endEvent': 'End',
      'task': 'Task',
      'exclusiveGateway': 'Gateway',
      'parallelGateway': 'Gateway',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'startEvent': return '#90EE90';
      case 'endEvent': return '#FF6B6B';
      case 'task': return '#4A90E2';
      case 'gateway': return '#F5A623';
      default: return '#888888';
    }
  };

  return (
    <Suspense fallback={null}>
      <group position={[0, 0.3, 0]}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.25, 0.5]} />
          <meshBasicMaterial 
            color="#000000" 
            opacity={0.95} 
            transparent 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <Text
          position={[0, 0.14, 0]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.1}
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {element.name || 'Unnamed'}
        </Text>
        
        <Text
          position={[0, -0.025, 0]}
          fontSize={0.06}
          color={getTypeColor(element.type)}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor="#000000"
        >
          {getTypeLabel(element.type)}
        </Text>
        
        <Text
          position={[0, -0.14, 0]}
          fontSize={0.045}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.1}
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          {element.description || element.id || 'No ID'}
        </Text>
      </group>
    </Suspense>
  );
}
