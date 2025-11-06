import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useXRInput, updateXRInput } from '../lib/useXRInput';

/**
 * XR Process Controller
 * Manages VR controller input for manipulating the BPMN process in 3D space
 *
 * CONTROL SCHEME:
 * ===============
 *
 * LEFT JOYSTICK:
 *   X-axis: Strafe left/right
 *   Y-axis: Move forward/back
 *   (Disabled during two-handed grip)
 *
 * RIGHT JOYSTICK:
 *   X-axis: Rotate around Y-axis (horizontal spin)
 *   Y-axis: Move up/down (vertical movement) - NEW!
 *   (Disabled during two-handed grip)
 *
 * GRIP BUTTONS:
 *   Both grips held: Two-handed manipulation
 *     - Pinch/spread hands = Scale (zoom in/out)
 *     - Rotate hands = Rotate process
 *     - Move hands together = Translate process
 *   (Includes haptic feedback)
 *
 * TRIGGER BUTTONS:
 *   Reserved for voice assistant (hold-to-speak)
 *   Not used by this controller
 */

/**
 * XR Controller Configuration
 * Extracted constants for easy tuning
 */
const CONTROLLER_CONFIG = {
  DEADZONE: 0.15,           // Joystick deadzone to prevent drift
  MOVE_SPEED: 0.06,         // Translation speed
  ROTATE_SPEED: 0.03,       // Rotation speed
  ZOOM_SPEED: 0.02,         // Scale speed (legacy, will be replaced by grip)
  MIN_SCALE: 0.3,           // Minimum process scale
  MAX_SCALE: 5.0,           // Maximum process scale
  LERP_FACTOR: 0.15,        // Smooth interpolation factor
  HAPTIC_INTENSITY: 0.5,    // Haptic feedback intensity (0-1)
  HAPTIC_DURATION: 100,     // Haptic feedback duration (ms)
} as const;

interface XRProcessControllerProps {
  children: React.ReactNode;
}

export function XRProcessController({ children }: XRProcessControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const xrInput = useXRInput();
  
  const transformState = useRef({
    // Current transform
    position: new THREE.Vector3(0, 0, 0),
    scale: 0.7,
    rotation: 0,

    // Two-handed grip state
    isGripping: false,
    gripStartLeftPos: new THREE.Vector3(),
    gripStartRightPos: new THREE.Vector3(),
    gripStartScale: 0.7,
    gripStartRotation: 0,
    gripStartProcessPos: new THREE.Vector3(),
  });

  /**
   * Trigger haptic feedback on a controller
   */
  const triggerHaptic = (controller: any, intensity: number, duration: number) => {
    if (!controller?.gamepad?.hapticActuators?.[0]) return;

    try {
      controller.gamepad.hapticActuators[0].pulse(intensity, duration);
    } catch (e) {
      console.warn('[XRProcessController] Haptic feedback failed:', e);
    }
  };

  /**
   * Get controller world position from XR controller
   */
  const getControllerWorldPosition = (controller: any): THREE.Vector3 | null => {
    if (!controller) return null;

    // Try to get position from the XR controller's world matrix
    // This is a simplified approach - in production, you'd get this from XRFrame
    try {
      // For Meta Quest controllers, we can approximate position from grip space
      const gripSpace = controller.gripSpace;
      if (!gripSpace) return null;

      // Get the reference space (this is a simplified version)
      // In a full implementation, you'd use XRFrame.getPose()
      const xrSession = gl.xr?.getSession?.();
      if (!xrSession) return null;

      // Return a placeholder - this will be refined in testing
      // The actual implementation depends on how @react-three/xr exposes controller positions
      return new THREE.Vector3(0, 1.5, -2); // Placeholder
    } catch (e) {
      console.warn('[XRProcessController] Failed to get controller position:', e);
      return null;
    }
  };

  useFrame(() => {
    if (!groupRef.current) return;

    updateXRInput(gl);

    const controllerState = xrInput.getState();
    const state = transformState.current;

    // Extract controller state
    const leftController = controllerState.leftController;
    const rightController = controllerState.rightController;
    const leftGrip = controllerState.buttons.leftGrip;
    const rightGrip = controllerState.buttons.rightGrip;

    const leftJoystickX = controllerState.axes.leftJoystickX;
    const leftJoystickY = controllerState.axes.leftJoystickY;
    const rightJoystickX = controllerState.axes.rightJoystickX;
    const rightJoystickY = controllerState.axes.rightJoystickY;

    // ===== PHASE 2: TWO-HANDED GRIP MANIPULATION =====
    if (leftGrip && rightGrip) {
      // Get controller positions
      const leftPos = getControllerWorldPosition(leftController);
      const rightPos = getControllerWorldPosition(rightController);

      if (leftPos && rightPos) {
        if (!state.isGripping) {
          // START GRIPPING
          console.log('[XRProcessController] 👐 Started two-handed grip');
          state.isGripping = true;
          state.gripStartLeftPos.copy(leftPos);
          state.gripStartRightPos.copy(rightPos);
          state.gripStartScale = state.scale;
          state.gripStartRotation = state.rotation;
          state.gripStartProcessPos.copy(state.position);

          // Haptic feedback on both controllers
          triggerHaptic(leftController, CONTROLLER_CONFIG.HAPTIC_INTENSITY, CONTROLLER_CONFIG.HAPTIC_DURATION);
          triggerHaptic(rightController, CONTROLLER_CONFIG.HAPTIC_INTENSITY, CONTROLLER_CONFIG.HAPTIC_DURATION);
        } else {
          // DURING GRIPPING

          // 1. SCALE from hand distance change (pinch-to-zoom)
          const startDist = state.gripStartLeftPos.distanceTo(state.gripStartRightPos);
          const currentDist = leftPos.distanceTo(rightPos);
          const scaleMultiplier = currentDist / (startDist || 1); // Prevent division by zero

          state.scale = Math.max(
            CONTROLLER_CONFIG.MIN_SCALE,
            Math.min(CONTROLLER_CONFIG.MAX_SCALE, state.gripStartScale * scaleMultiplier)
          );

          // 2. ROTATION from hand angle change
          const startAngle = Math.atan2(
            state.gripStartRightPos.z - state.gripStartLeftPos.z,
            state.gripStartRightPos.x - state.gripStartLeftPos.x
          );
          const currentAngle = Math.atan2(
            rightPos.z - leftPos.z,
            rightPos.x - leftPos.x
          );
          const rotationDelta = currentAngle - startAngle;
          state.rotation = state.gripStartRotation + rotationDelta;

          // 3. TRANSLATION from midpoint movement
          const startMidpoint = new THREE.Vector3()
            .addVectors(state.gripStartLeftPos, state.gripStartRightPos)
            .multiplyScalar(0.5);
          const currentMidpoint = new THREE.Vector3()
            .addVectors(leftPos, rightPos)
            .multiplyScalar(0.5);
          const positionDelta = new THREE.Vector3().subVectors(currentMidpoint, startMidpoint);
          state.position.copy(state.gripStartProcessPos).add(positionDelta);
        }
      }
    } else {
      // RELEASE GRIPPING
      if (state.isGripping) {
        console.log('[XRProcessController] ✋ Released two-handed grip');
        state.isGripping = false;

        // Light haptic on release
        triggerHaptic(leftController, 0.3, 50);
        triggerHaptic(rightController, 0.3, 50);
      }
    }

    // ===== PHASE 3: JOYSTICK CONTROLS (only when NOT gripping) =====
    if (!state.isGripping) {
      // LEFT JOYSTICK: Horizontal movement (X/Z plane)
      if (Math.abs(leftJoystickX) > CONTROLLER_CONFIG.DEADZONE) {
        state.position.x += leftJoystickX * CONTROLLER_CONFIG.MOVE_SPEED;
      }
      if (Math.abs(leftJoystickY) > CONTROLLER_CONFIG.DEADZONE) {
        state.position.z += leftJoystickY * CONTROLLER_CONFIG.MOVE_SPEED;
      }

      // RIGHT JOYSTICK: Rotation (X) + Vertical movement (Y)
      if (Math.abs(rightJoystickX) > CONTROLLER_CONFIG.DEADZONE) {
        state.rotation += rightJoystickX * CONTROLLER_CONFIG.ROTATE_SPEED;
      }
      if (Math.abs(rightJoystickY) > CONTROLLER_CONFIG.DEADZONE) {
        // NEW: Vertical movement (up/down on Y-axis)
        state.position.y -= rightJoystickY * CONTROLLER_CONFIG.MOVE_SPEED;
      }
    }

    // ===== APPLY TRANSFORMS WITH SMOOTH INTERPOLATION =====
    // Smooth position
    groupRef.current.position.lerp(state.position, CONTROLLER_CONFIG.LERP_FACTOR);

    // Smooth rotation
    const currentRotY = groupRef.current.rotation.y;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(currentRotY, state.rotation, CONTROLLER_CONFIG.LERP_FACTOR);

    // Smooth scale
    const currentScale = groupRef.current.scale.x;
    const targetScale = state.scale;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, CONTROLLER_CONFIG.LERP_FACTOR);
    groupRef.current.scale.setScalar(newScale);
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
