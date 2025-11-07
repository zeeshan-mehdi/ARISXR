import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useXRInput, updateXRInput } from '../lib/useXRInput';

interface XRProcessControllerProps {
  children: React.ReactNode;
}

export function XRProcessController({ children }: XRProcessControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const xrInput = useXRInput();
  
  const transformState = useRef({
    position: new THREE.Vector3(0, 0, 0),
    scale: 0.7,
    rotation: 0,
    
    leftGrip: false,
    rightGrip: false,
    bothGripping: false,
    
    grabStartPos: new THREE.Vector3(),
    grabStartTransform: new THREE.Vector3(),
    
    scaleStartDist: 0,
    scaleStartValue: 1
  });

  useFrame(() => {
    if (!groupRef.current) return;
    
    updateXRInput(gl);
    
    const controllerState = xrInput.getState();
    const state = transformState.current;
    
    const leftGrip = controllerState.buttons.leftGrip;
    const rightGrip = controllerState.buttons.rightGrip;
    
    const leftJoystickX = controllerState.axes.leftJoystickX;
    const leftJoystickY = controllerState.axes.leftJoystickY;
    const rightJoystickX = controllerState.axes.rightJoystickX;
    const rightJoystickY = controllerState.axes.rightJoystickY;
    
    if (Math.abs(leftJoystickX) > 0.15 || Math.abs(leftJoystickY) > 0.15) {
      state.position.x += leftJoystickX * 0.06;
      state.position.z += leftJoystickY * 0.06;
    }
    
    if (Math.abs(rightJoystickX) > 0.15) {
      state.rotation += rightJoystickX * 0.03;
    }
    
    if (Math.abs(rightJoystickY) > 0.15) {
      state.scale = Math.max(0.3, Math.min(5, state.scale - rightJoystickY * 0.02));
    }
    
    if (leftGrip && rightGrip) {
      if (!state.bothGripping) {
        state.bothGripping = true;
      }
    } else if (leftGrip && !state.leftGrip) {
      state.leftGrip = true;
    } else if (rightGrip && !state.rightGrip) {
      state.rightGrip = true;
    }
    
    if (!leftGrip) state.leftGrip = false;
    if (!rightGrip) state.rightGrip = false;
    if (!leftGrip || !rightGrip) state.bothGripping = false;

    groupRef.current.position.copy(state.position);
    groupRef.current.rotation.y = state.rotation;
    groupRef.current.scale.setScalar(state.scale);
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}