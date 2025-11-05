import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXRInputSourceState } from '@react-three/xr';
import * as THREE from 'three';

interface XRProcessControllerProps {
  children: React.ReactNode;
}

export function XRProcessController({ children }: XRProcessControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  
  const leftInputSource = useXRInputSourceState('controller', 'left');
  const rightInputSource = useXRInputSourceState('controller', 'right');
  
  const lastLeftJoystick = useRef({ x: 0, y: 0 });
  const lastRightJoystick = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current) return;

    try {
      const leftGamepad = leftInputSource?.gamepad as any;
      const rightGamepad = rightInputSource?.gamepad as any;
      
      if (leftGamepad?.axes && Array.isArray(leftGamepad.axes)) {
        const joystickX = leftGamepad.axes[2] || 0;
        const joystickY = leftGamepad.axes[3] || 0;
        
        if (Math.abs(joystickX) > 0.1 || Math.abs(joystickY) > 0.1) {
          setPosition(prev => [
            prev[0] + joystickX * 0.02,
            prev[1],
            prev[2] + joystickY * 0.02
          ]);
        }
        
        lastLeftJoystick.current = { x: joystickX, y: joystickY };
      }
      
      if (rightGamepad?.axes && Array.isArray(rightGamepad.axes)) {
        const joystickX = rightGamepad.axes[2] || 0;
        const joystickY = rightGamepad.axes[3] || 0;
        
        if (Math.abs(joystickX) > 0.1) {
          setRotation(prev => prev + joystickX * 0.02);
        }
        
        if (Math.abs(joystickY) > 0.1) {
          setScale(prev => Math.max(0.5, Math.min(3, prev + joystickY * 0.01)));
        }
        
        lastRightJoystick.current = { x: joystickX, y: joystickY };
      }

      groupRef.current.position.set(...position);
      groupRef.current.rotation.y = rotation;
      groupRef.current.scale.setScalar(scale);
    } catch (error) {
      console.error('XR controller error:', error);
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
