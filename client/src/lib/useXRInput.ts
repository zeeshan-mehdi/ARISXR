import { useCallback, useMemo } from 'react';

export interface XRControllerState {
  leftController: XRInputSource | null;
  rightController: XRInputSource | null;
  buttons: {
    leftTrigger: boolean;
    rightTrigger: boolean;
    leftGrip: boolean;
    rightGrip: boolean;
  };
  axes: {
    leftJoystickX: number;
    leftJoystickY: number;
    rightJoystickX: number;
    rightJoystickY: number;
  };
}

interface ButtonPressHandler {
  id: string;
  button: 'leftTrigger' | 'rightTrigger' | 'leftGrip' | 'rightGrip';
  onPress: () => void;
}

const controllerState: XRControllerState = {
  leftController: null,
  rightController: null,
  buttons: {
    leftTrigger: false,
    rightTrigger: false,
    leftGrip: false,
    rightGrip: false,
  },
  axes: {
    leftJoystickX: 0,
    leftJoystickY: 0,
    rightJoystickX: 0,
    rightJoystickY: 0,
  }
};

const lastButtonState = {
  leftTrigger: false,
  rightTrigger: false,
  leftGrip: false,
  rightGrip: false,
};

const buttonPressHandlers: ButtonPressHandler[] = [];

export function updateXRInput(gl: any) {
  const xrSession = gl.xr.getSession();
  if (!xrSession) return;

  const inputSources = Array.from(xrSession.inputSources);
  
  let leftController: XRInputSource | null = null;
  let rightController: XRInputSource | null = null;
  
  for (const source of inputSources) {
    if ((source as XRInputSource).handedness === 'left') leftController = source as XRInputSource;
    if ((source as XRInputSource).handedness === 'right') rightController = source as XRInputSource;
  }
  
  controllerState.leftController = leftController;
  controllerState.rightController = rightController;
  
  const leftTrigger = leftController?.gamepad?.buttons[0]?.pressed || false;
  const rightTrigger = rightController?.gamepad?.buttons[0]?.pressed || false;
  const leftGrip = leftController?.gamepad?.buttons[1]?.pressed || false;
  const rightGrip = rightController?.gamepad?.buttons[1]?.pressed || false;
  
  controllerState.buttons = {
    leftTrigger,
    rightTrigger,
    leftGrip,
    rightGrip,
  };
  
  controllerState.axes = {
    leftJoystickX: leftController?.gamepad?.axes[2] || 0,
    leftJoystickY: leftController?.gamepad?.axes[3] || 0,
    rightJoystickX: rightController?.gamepad?.axes[2] || 0,
    rightJoystickY: rightController?.gamepad?.axes[3] || 0,
  };
  
  if (leftTrigger && !lastButtonState.leftTrigger) {
    console.log('[XRInput] LEFT TRIGGER pressed, firing', buttonPressHandlers.filter(h => h.button === 'leftTrigger').length, 'handlers');
    buttonPressHandlers.filter(h => h.button === 'leftTrigger').forEach(h => h.onPress());
  }
  if (rightTrigger && !lastButtonState.rightTrigger) {
    console.log('[XRInput] RIGHT TRIGGER pressed, firing', buttonPressHandlers.filter(h => h.button === 'rightTrigger').length, 'handlers');
    buttonPressHandlers.filter(h => h.button === 'rightTrigger').forEach(h => h.onPress());
  }
  if (leftGrip && !lastButtonState.leftGrip) {
    console.log('[XRInput] LEFT GRIP pressed, firing', buttonPressHandlers.filter(h => h.button === 'leftGrip').length, 'handlers');
    buttonPressHandlers.filter(h => h.button === 'leftGrip').forEach(h => h.onPress());
  }
  if (rightGrip && !lastButtonState.rightGrip) {
    console.log('[XRInput] RIGHT GRIP pressed, firing', buttonPressHandlers.filter(h => h.button === 'rightGrip').length, 'handlers');
    buttonPressHandlers.filter(h => h.button === 'rightGrip').forEach(h => h.onPress());
  }
  
  lastButtonState.leftTrigger = leftTrigger;
  lastButtonState.rightTrigger = rightTrigger;
  lastButtonState.leftGrip = leftGrip;
  lastButtonState.rightGrip = rightGrip;
}

export function useXRInput() {
  const registerButtonPress = useCallback((button: ButtonPressHandler['button'], onPress: () => void): string => {
    const id = `${button}-${Date.now()}-${Math.random()}`;
    buttonPressHandlers.push({ id, button, onPress });
    console.log(`Registered ${button} handler:`, id);
    return id;
  }, []);

  const unregisterButtonPress = useCallback((id: string) => {
    const index = buttonPressHandlers.findIndex(h => h.id === id);
    if (index !== -1) {
      console.log('Unregistered handler:', id);
      buttonPressHandlers.splice(index, 1);
    }
  }, []);

  return useMemo(() => ({
    getState: () => controllerState,
    registerButtonPress,
    unregisterButtonPress,
  }), [registerButtonPress, unregisterButtonPress]);
}
