import { useState, useCallback } from 'react';

export function useXRSession() {
  const [isXRSupported, setIsXRSupported] = useState(false);
  const [isInXR, setIsInXR] = useState(false);

  const checkXRSupport = useCallback(async () => {
    if ('xr' in navigator) {
      try {
        const supported = await navigator.xr?.isSessionSupported('immersive-ar');
        setIsXRSupported(!!supported);
        return !!supported;
      } catch (error) {
        console.error('Error checking XR support:', error);
        return false;
      }
    }
    return false;
  }, []);

  return {
    isXRSupported,
    isInXR,
    setIsInXR,
    checkXRSupport,
  };
}
