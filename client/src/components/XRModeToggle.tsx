import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../lib/stores/useGame';
import { Interactive } from '@react-three/xr';

interface XRModeToggleProps {
  onToggle: () => void;
}

export function XRModeToggle({ onToggle }: XRModeToggleProps) {
  const { supportsAR, supportsVR, xrSessionType } = useGame();
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<THREE.Mesh>(null);
  
  // Only show if device supports both modes
  if (!supportsAR || !supportsVR) {
    return null;
  }
  
  // Animate button
  useFrame((state) => {
    if (buttonRef.current) {
      const time = state.clock.elapsedTime;
      buttonRef.current.position.y = -0.8 + Math.sin(time * 2) * 0.02;
      
      if (hovered) {
        buttonRef.current.scale.setScalar(1.1 + Math.sin(time * 5) * 0.05);
      } else {
        buttonRef.current.scale.setScalar(1);
      }
    }
  });
  
  const currentModeText = xrSessionType === 'ar' ? 'AR MODE' : 'VR MODE';
  const switchToText = xrSessionType === 'ar' ? 'Switch to VR' : 'Switch to AR';
  const buttonColor = xrSessionType === 'ar' ? '#00ffff' : '#ff00ff';
  
  return (
    <group position={[2.5, 1.2, -1]}>
      {/* Interactive button */}
      <Interactive
        onSelect={() => {
          console.log('[XRModeToggle] Button selected - toggling mode');
          onToggle();
        }}
        onHover={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <mesh ref={buttonRef}>
          <boxGeometry args={[0.5, 0.15, 0.05]} />
          <meshStandardMaterial
            color={buttonColor}
            emissive={buttonColor}
            emissiveIntensity={hovered ? 1.2 : 0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Interactive>
      
      {/* Current mode label (above button) */}
      <Text
        position={[0, 0.15, 0.03]}
        fontSize={0.04}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.002}
        outlineColor="#000000"
      >
        {currentModeText}
      </Text>
      
      {/* Action text (on button) */}
      <Text
        position={[0, -0.8, 0.03]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#000000"
        fontWeight="bold"
      >
        {switchToText}
      </Text>
      
      {/* Glow effect */}
      {hovered && (
        <pointLight
          position={[0, -0.8, 0.1]}
          intensity={1.5}
          color={buttonColor}
          distance={1}
        />
      )}
    </group>
  );
}
