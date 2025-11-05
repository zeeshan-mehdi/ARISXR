import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useXR } from "@react-three/xr";
import type { BPMNElement } from "../lib/bpmnParser";
import { XRInfoPanel } from "./XRInfoPanel";

interface BPMNElement3DProps {
  element: BPMNElement;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: (screenPosition: { x: number; y: number }) => void;
}

export function BPMNElement3D({ element, position, isSelected, onClick, onDoubleClick }: BPMNElement3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { camera, size } = useThree();
  const lastClickRef = useRef<number>(0);
  const isXR = useXR((state) => state !== null);

  useFrame(() => {
    if (meshRef.current && (isSelected || hovered)) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getGeometry = () => {
    switch (element.type) {
      case 'startEvent':
      case 'endEvent':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'task':
        return <boxGeometry args={[1.5, 1, 0.5]} />;
      case 'gateway':
        return <octahedronGeometry args={[0.6, 0]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getColor = () => {
    if (isSelected) return '#FFD700';
    if (hovered) return '#87CEEB';
    
    switch (element.type) {
      case 'startEvent':
        return '#90EE90';
      case 'endEvent':
        return '#FF6B6B';
      case 'task':
        return '#4A90E2';
      case 'gateway':
        return '#F5A623';
      default:
        return '#888888';
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Clicked element:', element.name, 'isXR:', isXR);
          
          if (isXR) {
            onClick();
            return;
          }
          
          const now = Date.now();
          const timeSinceLastClick = now - lastClickRef.current;
          
          if (timeSinceLastClick < 300) {
            const worldPos = new THREE.Vector3(...position);
            const screenPos = worldPos.project(camera);
            
            const x = (screenPos.x * 0.5 + 0.5) * size.width;
            const y = ((-screenPos.y) * 0.5 + 0.5) * size.height;
            
            onDoubleClick({ x, y });
          } else {
            onClick();
          }
          
          lastClickRef.current = now;
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          console.log('Pointer over:', element.name, 'isXR:', isXR);
          setHovered(true);
          if (!isXR) {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          console.log('Pointer out:', element.name);
          setHovered(false);
          if (!isXR) {
            document.body.style.cursor = 'auto';
          }
        }}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={getColor()}
          emissive={isSelected || hovered ? getColor() : '#000000'}
          emissiveIntensity={isSelected || hovered ? 0.3 : 0}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {element.name}
      </Text>
      
      {isXR && (isSelected || hovered) && (
        <XRInfoPanel element={element} />
      )}
    </group>
  );
}
