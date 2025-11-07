import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FuturisticWorld() {
  const floatingRing1Ref = useRef<THREE.Mesh>(null);
  const floatingRing2Ref = useRef<THREE.Mesh>(null);
  const floatingRing3Ref = useRef<THREE.Mesh>(null);
  
  // Animate floating rings
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (floatingRing1Ref.current) {
      floatingRing1Ref.current.rotation.x = time * 0.2;
      floatingRing1Ref.current.rotation.y = time * 0.3;
      floatingRing1Ref.current.position.y = 8 + Math.sin(time * 0.5) * 0.5;
    }
    
    if (floatingRing2Ref.current) {
      floatingRing2Ref.current.rotation.x = -time * 0.15;
      floatingRing2Ref.current.rotation.z = time * 0.25;
      floatingRing2Ref.current.position.y = 6 + Math.cos(time * 0.6) * 0.4;
    }
    
    if (floatingRing3Ref.current) {
      floatingRing3Ref.current.rotation.y = time * 0.4;
      floatingRing3Ref.current.rotation.z = -time * 0.2;
      floatingRing3Ref.current.position.y = 10 + Math.sin(time * 0.7) * 0.6;
    }
  });
  
  // Create hexagonal grid pattern for platform - optimized material
  const hexGridMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1a1a3e',
      emissive: '#4a3aff',
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
    });
  }, []);
  
  // Particle positions for ambient effects (optimized count)
  const particleCount = 100;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 20 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
    }
    return positions;
  }, []);

  return (
    <group>
      {/* Skybox - Gradient Sphere */}
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial 
          color="#1a0033" 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Gradient Sky Inner Layer */}
      <mesh>
        <sphereGeometry args={[95, 32, 32]} />
        <meshBasicMaterial 
          color="#2a0a4d" 
          side={THREE.BackSide}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Main Platform - Hexagonal Grid */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[20, 6]} />
        <primitive object={hexGridMaterial} attach="material" />
      </mesh>
      
      {/* Platform Glow Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[19.5, 20, 64]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner Platform Hexagons */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[15, 6]} />
        <meshStandardMaterial 
          color="#0a0a2e"
          emissive="#6a4aff"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* Floating Holographic Rings */}
      <mesh 
        ref={floatingRing1Ref}
        position={[-8, 8, -10]}
      >
        <torusGeometry args={[2, 0.1, 16, 32]} />
        <meshStandardMaterial 
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
      
      <mesh 
        ref={floatingRing2Ref}
        position={[10, 6, -8]}
      >
        <torusGeometry args={[1.5, 0.08, 16, 32]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
      
      <mesh 
        ref={floatingRing3Ref}
        position={[0, 10, -12]}
      >
        <torusGeometry args={[3, 0.12, 16, 32]} />
        <meshStandardMaterial 
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.9}
          transparent
          opacity={0.5}
          wireframe
        />
      </mesh>

      {/* Geometric Floating Panels */}
      <mesh position={[-12, 4, -6]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[3, 4, 0.1]} />
        <meshStandardMaterial 
          color="#6600ff"
          emissive="#6600ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      <mesh position={[12, 5, -8]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial 
          color="#0088ff"
          emissive="#0088ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Cyberpunk Lighting */}
      <ambientLight intensity={0.3} color="#4400aa" />
      
      {/* Main directional light (cyan rim light) */}
      <directionalLight 
        position={[10, 15, 5]} 
        intensity={0.8} 
        color="#00ffff"
        castShadow
      />
      
      {/* Accent point lights */}
      <pointLight 
        position={[-10, 5, -5]} 
        intensity={1.5} 
        color="#ff00ff"
        distance={20}
      />
      
      <pointLight 
        position={[10, 5, -5]} 
        intensity={1.5} 
        color="#00ffff"
        distance={20}
      />
      
      <pointLight 
        position={[0, 8, -10]} 
        intensity={1.2} 
        color="#ff0088"
        distance={15}
      />
      
      {/* Ground rim light */}
      <pointLight 
        position={[0, 0.5, 0]} 
        intensity={0.8} 
        color="#4400ff"
        distance={25}
      />
      
      {/* Floating particles for atmosphere */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00ffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
