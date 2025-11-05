import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';

interface XRProcessControllerProps {
  children: React.ReactNode;
}

export function XRProcessController({ children }: XRProcessControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const xrSession = gl.xr.getSession();
  
  const transformState = useRef({
    position: new THREE.Vector3(0, 0, 0),
    scale: 1,
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
    if (!groupRef.current || !xrSession) return;

    const inputSources = Array.from(xrSession.inputSources);
    const state = transformState.current;
    
    let leftController: XRInputSource | null = null;
    let rightController: XRInputSource | null = null;
    
    for (const source of inputSources) {
      if (source.handedness === 'left') leftController = source;
      if (source.handedness === 'right') rightController = source;
    }
    
    const leftGrip = leftController?.gamepad?.buttons[1]?.pressed || false;
    const rightGrip = rightController?.gamepad?.buttons[1]?.pressed || false;
    
    console.log('Controllers:', { leftGrip, rightGrip, inputSourcesCount: inputSources.length });
    
    const leftJoystickX = leftController?.gamepad?.axes[2] || 0;
    const leftJoystickY = leftController?.gamepad?.axes[3] || 0;
    const rightJoystickX = rightController?.gamepad?.axes[2] || 0;
    const rightJoystickY = rightController?.gamepad?.axes[3] || 0;
    
    if (Math.abs(leftJoystickX) > 0.15 || Math.abs(leftJoystickY) > 0.15) {
      state.position.x += leftJoystickX * 0.03;
      state.position.z += leftJoystickY * 0.03;
      console.log('Moving with left joystick');
    }
    
    if (Math.abs(rightJoystickX) > 0.15) {
      state.rotation += rightJoystickX * 0.03;
      console.log('Rotating with right joystick');
    }
    
    if (Math.abs(rightJoystickY) > 0.15) {
      state.scale = Math.max(0.3, Math.min(5, state.scale - rightJoystickY * 0.02));
      console.log('Scaling with right joystick:', state.scale);
    }
    
    if (leftGrip && rightGrip) {
      if (!state.bothGripping) {
        state.bothGripping = true;
        console.log('Both grips pressed - pinch zoom enabled');
      }
    } else if (leftGrip && !state.leftGrip) {
      state.leftGrip = true;
      console.log('Left grip pressed - drag enabled');
    } else if (rightGrip && !state.rightGrip) {
      state.rightGrip = true;
      console.log('Right grip pressed - drag enabled');
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
