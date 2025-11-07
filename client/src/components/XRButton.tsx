import { useEffect, useState } from 'react';
import { useGame } from '../lib/stores/useGame';

interface XRButtonProps {
  onEnterXR: (mode: 'ar' | 'vr') => void;
  isInXR: boolean;
}

export function XRButton({ onEnterXR, isInXR }: XRButtonProps) {
  const { xrModePreference, supportsAR, supportsVR, setXRSupport } = useGame();
  const [xrMode, setXrMode] = useState<'ar' | 'vr' | null>(null);

  useEffect(() => {
    console.log('[XRButton] Component mounted, checking XR support...');
    console.log('[XRButton] isInXR:', isInXR);
    console.log('[XRButton] navigator.xr available:', 'xr' in navigator);
    
    const checkSupport = async () => {
      if ('xr' in navigator && navigator.xr) {
        console.log('[XRButton] navigator.xr detected, checking session support...');
        try {
          // Check both AR and VR support
          console.log('[XRButton] Testing immersive-ar support...');
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
          console.log('[XRButton] immersive-ar supported:', arSupported);
          
          console.log('[XRButton] Testing immersive-vr support...');
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
          console.log('[XRButton] immersive-vr supported:', vrSupported);
          
          // Store capabilities
          setXRSupport(arSupported, vrSupported);
          
          // Determine which mode to use based on support and preference
          if (arSupported && vrSupported) {
            // Device supports both (Quest 3) - use preference
            console.log('[XRButton] ✓ Both AR and VR supported - using preference:', xrModePreference);
            setXrMode(xrModePreference);
          } else if (arSupported) {
            console.log('[XRButton] ✓ AR Mode only');
            setXrMode('ar');
          } else if (vrSupported) {
            console.log('[XRButton] ✓ VR Mode only');
            setXrMode('vr');
          } else {
            console.log('[XRButton] ✗ No XR support detected');
            setXrMode(null);
          }
        } catch (error) {
          console.error('[XRButton] ✗ XR support check failed:', error);
          setXrMode(null);
        }
      } else {
        console.log('[XRButton] ✗ navigator.xr not available in this browser');
        setXrMode(null);
      }
    };
    checkSupport();
  }, [isInXR, xrModePreference, setXRSupport]);

  console.log('[XRButton] Render - xrMode:', xrMode, 'isInXR:', isInXR);
  
  if (!xrMode || isInXR) {
    console.log('[XRButton] Not rendering button - xrMode:', xrMode, 'isInXR:', isInXR);
    return null;
  }

  // Show capability if both modes are supported
  const bothModesSupported = supportsAR && supportsVR;
  const buttonText = xrMode === 'ar' 
    ? (bothModesSupported ? 'Enter AR Mode' : 'Enter Mixed Reality')
    : (bothModesSupported ? 'Enter VR Mode' : 'Enter Virtual Reality');
  console.log('[XRButton] Rendering button:', buttonText);

  return (
    <button
      onClick={() => {
        console.log('[XRButton] Button clicked! Mode:', xrMode);
        onEnterXR(xrMode);
      }}
      className="fixed bottom-8 right-8 z-[9999] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 rounded-2xl font-bold text-xl shadow-2xl flex items-center gap-4 transition-all transform hover:scale-110 animate-pulse border-4 border-white"
      style={{ 
        boxShadow: '0 0 40px rgba(147, 51, 234, 0.8), 0 0 80px rgba(59, 130, 246, 0.6)',
        minWidth: '300px',
        minHeight: '80px'
      }}
    >
      <svg 
        className="w-10 h-10" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span className="text-2xl">{buttonText}</span>
    </button>
  );
}
