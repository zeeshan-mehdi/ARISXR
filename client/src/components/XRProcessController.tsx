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
  const leftHandInputSource = useXRInputSourceState('hand', 'left');
  const rightHandInputSource = useXRInputSourceState('hand', 'right');
  
  const lastLeftJoystick = useRef({ x: 0, y: 0 });
  const lastRightJoystick = useRef({ x: 0, y: 0 });
  
  const grabState = useRef({
    isGrabbing: false,
    startPosition: new THREE.Vector3(),
    startProcessPosition: new THREE.Vector3(),
    leftPinching: false,
    rightPinching: false,
    initialDistance: 0,
    initialScale: 1,
    leftHandPos: new THREE.Vector3(),
    rightHandPos: new THREE.Vector3()
  });

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

      const leftHandGamepad = (leftHandInputSource as any)?.gamepad;
      const rightHandGamepad = (rightHandInputSource as any)?.gamepad;
      
      const leftPinching = leftHandGamepad?.buttons?.[1]?.pressed || false;
      const rightPinching = rightHandGamepad?.buttons?.[1]?.pressed || false;

      if ((leftHandInputSource as any)?.hand && (rightHandInputSource as any)?.hand) {
        const leftIndexTip = (leftHandInputSource as any).hand.get('index-finger-tip');
        const rightIndexTip = (rightHandInputSource as any).hand.get('index-finger-tip');
        
        if (leftIndexTip && rightIndexTip) {
          const leftPos = new THREE.Vector3();
          const rightPos = new THREE.Vector3();
          leftIndexTip.getWorldPosition(leftPos);
          rightIndexTip.getWorldPosition(rightPos);
          
          grabState.current.leftHandPos.copy(leftPos);
          grabState.current.rightHandPos.copy(rightPos);
          
          if (leftPinching && rightPinching) {
            const currentDistance = leftPos.distanceTo(rightPos);
            
            if (!grabState.current.leftPinching || !grabState.current.rightPinching) {
              grabState.current.initialDistance = currentDistance;
              grabState.current.initialScale = scale;
              console.log('Two-hand pinch started - scaling enabled');
            } else {
              const scaleChange = currentDistance / grabState.current.initialDistance;
              const newScale = Math.max(0.3, Math.min(5, grabState.current.initialScale * scaleChange));
              setScale(newScale);
            }
          } else if (leftPinching && !grabState.current.isGrabbing) {
            grabState.current.isGrabbing = true;
            grabState.current.startPosition.copy(leftPos);
            grabState.current.startProcessPosition.set(...position);
            console.log('Left hand grab started - drag enabled');
          } else if (rightPinching && !grabState.current.isGrabbing) {
            grabState.current.isGrabbing = true;
            grabState.current.startPosition.copy(rightPos);
            grabState.current.startProcessPosition.set(...position);
            console.log('Right hand grab started - drag enabled');
          }
          
          if (grabState.current.isGrabbing && (leftPinching || rightPinching)) {
            const currentHandPos = leftPinching ? leftPos : rightPos;
            const delta = new THREE.Vector3().subVectors(currentHandPos, grabState.current.startPosition);
            
            setPosition([
              grabState.current.startProcessPosition.x + delta.x,
              grabState.current.startProcessPosition.y + delta.y,
              grabState.current.startProcessPosition.z + delta.z
            ]);
          }
          
          if (!leftPinching && !rightPinching && grabState.current.isGrabbing) {
            grabState.current.isGrabbing = false;
            console.log('Grab released');
          }
        }
      }
      
      grabState.current.leftPinching = leftPinching;
      grabState.current.rightPinching = rightPinching;

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
