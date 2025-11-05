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
      <group position={[0, 1.5, 0]}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[2, 0.8]} />
          <meshBasicMaterial 
            color="#000000" 
            opacity={0.9} 
            transparent 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {element.name || 'Unnamed'}
        </Text>
        
        <Text
          position={[0, -0.05, 0]}
          fontSize={0.08}
          color={getTypeColor(element.type)}
          anchorX="center"
          anchorY="middle"
        >
          {getTypeLabel(element.type)}
        </Text>
        
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.06}
          color="#999999"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {element.id || 'No ID'}
        </Text>
      </group>
    </Suspense>
  );
}
