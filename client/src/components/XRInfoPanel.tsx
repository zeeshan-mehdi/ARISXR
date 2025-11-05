import { Text } from '@react-three/drei';
import { useEffect } from 'react';
import type { BPMNElement } from '../lib/bpmnParser';
import * as THREE from 'three';

interface XRInfoPanelProps {
  element: BPMNElement;
}

export function XRInfoPanel({ element }: XRInfoPanelProps) {
  useEffect(() => {
    console.log('XRInfoPanel rendered for:', element.name);
  }, [element.name]);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'startEvent': 'Start Event',
      'endEvent': 'End Event',
      'task': 'Task',
      'exclusiveGateway': 'Decision Gateway',
      'parallelGateway': 'Parallel Gateway',
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
    <group position={[0, 1.8, 0]}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.5, 1.2]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          opacity={0.95} 
          transparent 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.48, 1.18]} />
        <meshStandardMaterial 
          color={getTypeColor(element.type)} 
          opacity={0.3} 
          transparent 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <Text
        position={[0, 0.35, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
        textAlign="center"
        font="/fonts/inter-bold.woff"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {element.name}
      </Text>
      
      <Text
        position={[0, 0.1, 0]}
        fontSize={0.1}
        color={getTypeColor(element.type)}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
        textAlign="center"
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        {getTypeLabel(element.type)}
      </Text>
      
      <Text
        position={[0, -0.15, 0]}
        fontSize={0.08}
        color="#888888"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
        textAlign="center"
        outlineWidth={0.006}
        outlineColor="#000000"
      >
        ID: {element.id}
      </Text>

      {element.incoming && element.incoming.length > 0 && (
        <Text
          position={[0, -0.35, 0]}
          fontSize={0.07}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.3}
          textAlign="center"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          Incoming: {element.incoming.length} | Outgoing: {element.outgoing?.length || 0}
        </Text>
      )}
    </group>
  );
}
