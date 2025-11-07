import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FuturisticWorld() {
  const ringRef = useRef<THREE.Mesh>(null);
  
  // Gentle rotation for the accent ring
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group>
      {/* Simple gradient sky dome */}
      <mesh>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial 
          color="#0a0a1a" 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Circular platform */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial 
          color="#0d0d20"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Platform edge glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[14.5, 15, 64]} />
        <meshBasicMaterial 
          color="#4a6aff" 
          transparent 
          opacity={0.5}
        />
      </mesh>

      {/* Single floating accent ring */}
      <mesh 
        ref={ringRef}
        position={[0, 3, -6]}
      >
        <torusGeometry args={[2, 0.08, 16, 32]} />
        <meshStandardMaterial 
          color="#6a8aff"
          emissive="#6a8aff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Minimal lighting */}
      <ambientLight intensity={0.4} color="#2a3a5a" />
      <directionalLight 
        position={[5, 8, 3]} 
        intensity={0.6} 
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[0, 2, 0]} 
        intensity={0.4} 
        color="#4a6aff"
        distance={20}
      />
    </group>
  );
}
