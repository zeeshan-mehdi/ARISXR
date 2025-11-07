import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function RobotScene() {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const [model, setModel] = useState<THREE.Group | null>(null);

  // Load the GLTF model using useGLTF from drei
  const gltf = useGLTF('/models/gltf/RobotExpressive/RobotExpressive.glb') as any;

  useEffect(() => {
    if (!gltf || !gltf.scene) return;

    // Don't clone - use the original model for proper skeleton binding
    const loadedModel = gltf.scene;

    // Change robot colors to match the design - white/gray body with black eyes
    loadedModel.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Clone material to avoid shared material issues
        child.material = child.material.clone();

        const color = child.material.color;
        const brightness = (color.r + color.g + color.b) / 3;

        // Very dark parts (eyes, joints) ->
        if (brightness < 0.25) {
          child.material.color.setHex(0x3B3A39);
        }
        // Yellow/orange parts (bright, warm colors) -> lime green #AFCE12
        else if (color.r > 0.6 && color.g > 0.5 && color.b < 0.4) {
          child.material.color.setHex(0xafce12);
        }
        // Very light/white parts -> light gray #C8C8C8
        else if (brightness > 0.8) {
          child.material.color.setHex(0xc8c8c8);
        }
        // Medium brightness parts -> medium-dark gray #A19F9D
        else if (brightness >= 0.25 && brightness < 0.6) {
          child.material.color.setHex(0xa19f9d);
        }
        // Everything else (medium-bright) -> medium gray #8A8886
        else {
          child.material.color.setHex(0x3B3A39);
        }
      }
    });

    setModel(loadedModel);

    // Setup animation mixer and play Wave animation every 3 seconds
    const mixer = new THREE.AnimationMixer(loadedModel);
    mixerRef.current = mixer;

    let timeoutId: NodeJS.Timeout;
    const waveClip = THREE.AnimationClip.findByName(gltf.animations, 'Wave');

    if (waveClip) {
      const waveAction = mixer.clipAction(waveClip);
      waveAction.loop = THREE.LoopOnce;
      waveAction.clampWhenFinished = true;

      // Play wave animation every 3 seconds
      const playWave = () => {
        waveAction.reset();
        waveAction.play();
        timeoutId = setTimeout(playWave, 3000);
      };
      playWave();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      mixer.stopAllAction();
    };
  }, [gltf]);

  // Animation loop
  useFrame(() => {
    if (mixerRef.current) {
      const delta = clockRef.current.getDelta();
      mixerRef.current.update(delta);
    }
  });

  return (
    <>
      {/* Fog */}
      <fog attach="fog" args={[0x312e81, 20, 100]} />

      {/* Lights */}
      <hemisphereLight args={[0xffffff, 0x8d8d8d, 3]} position={[0, 20, 0]} />
      <directionalLight args={[0xffffff, 3]} position={[0, 20, 10]} />

      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial
          color={0x000000}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Robot model */}
      {model && <primitive object={model} />}
    </>
  );
}
