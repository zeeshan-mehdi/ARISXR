import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function FuturisticWorld() {
  // Pre-calculate rock positions for consistent rendering
  const rockPositions = useMemo(() => [
    { pos: [-8, 0.3, -12], scale: [1.5, 0.8, 1.2], rotation: 0.3 },
    { pos: [10, 0.5, -15], scale: [2, 1.2, 1.8], rotation: -0.5 },
    { pos: [-12, 0.4, -8], scale: [1.2, 0.6, 1], rotation: 0.8 },
    { pos: [6, 0.3, -10], scale: [1, 0.5, 0.8], rotation: -0.2 },
    { pos: [0, 0.6, -18], scale: [2.5, 1.5, 2], rotation: 0 },
  ], []);

  return (
    <group>
      {/* Mars Sky - Reddish atmosphere */}
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial 
          color="#d4704a" 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Atmospheric glow layer */}
      <mesh>
        <sphereGeometry args={[95, 32, 32]} />
        <meshBasicMaterial 
          color="#e88860" 
          side={THREE.BackSide}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Martian desert ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial 
          color="#b85c3a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Rocky formations in the distance */}
      {rockPositions.map((rock, i) => (
        <mesh 
          key={i}
          position={rock.pos as [number, number, number]}
          rotation={[0, rock.rotation, 0]}
          castShadow
        >
          <boxGeometry args={rock.scale as [number, number, number]} />
          <meshStandardMaterial 
            color="#8b4513"
            roughness={0.95}
          />
        </mesh>
      ))}

      {/* Mars lighting - warm and dusty */}
      <ambientLight intensity={0.5} color="#ffaa77" />
      
      {/* Sun directional light */}
      <directionalLight 
        position={[20, 25, 10]} 
        intensity={0.8} 
        color="#ffbb88"
        castShadow
      />
      
      {/* Soft fill light for visibility */}
      <pointLight 
        position={[0, 3, 0]} 
        intensity={0.3} 
        color="#ff8855"
        distance={25}
      />
      
      {/* ARIS Flag - decorative element */}
      <group position={[-6, 0, -8]} rotation={[0, 0.3, 0]}>
        {/* Flag pole */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Flag */}
        <mesh position={[0.3, 2.5, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshStandardMaterial 
            color="#0066cc" 
            side={THREE.DoubleSide}
            emissive="#0044aa"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* ARIS Text on flag */}
        <Text
          position={[0.3, 2.5, 0.01]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.01}
          outlineColor="#003366"
        >
          ARIS
        </Text>
      </group>
    </group>
  );
}
