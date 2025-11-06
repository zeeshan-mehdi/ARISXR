import { useEffect, useState } from 'react';

interface XRButtonProps {
  onEnterXR: (mode: 'ar' | 'vr') => void;
  isInXR: boolean;
}

export function XRButton({ onEnterXR, isInXR }: XRButtonProps) {
  const [xrMode, setXrMode] = useState<'ar' | 'vr' | null>(null);

  useEffect(() => {
    console.log('[XRButton] Component mounted, checking XR support...');
    console.log('[XRButton] isInXR:', isInXR);
    console.log('[XRButton] navigator.xr available:', 'xr' in navigator);
    
    const checkSupport = async () => {
      if ('xr' in navigator && navigator.xr) {
        console.log('[XRButton] navigator.xr detected, checking session support...');
        try {
          // Check AR support first (Meta Quest 3)
          console.log('[XRButton] Testing immersive-ar support...');
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
          console.log('[XRButton] immersive-ar supported:', arSupported);
          
          if (arSupported) {
            console.log('[XRButton] ✓ AR Mode detected (Meta Quest 3)');
            setXrMode('ar');
            return;
          }
          
          // Check VR support (Apple Vision Pro)
          console.log('[XRButton] Testing immersive-vr support...');
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
          console.log('[XRButton] immersive-vr supported:', vrSupported);
          
          if (vrSupported) {
            console.log('[XRButton] ✓ VR Mode detected (Apple Vision Pro)');
            setXrMode('vr');
            return;
          }
          
          console.log('[XRButton] ✗ No XR support detected (neither AR nor VR)');
          setXrMode(null);
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
  }, [isInXR]);

  console.log('[XRButton] Render - xrMode:', xrMode, 'isInXR:', isInXR);
  
  if (!xrMode || isInXR) {
    console.log('[XRButton] Not rendering button - xrMode:', xrMode, 'isInXR:', isInXR);
    return null;
  }

  const buttonText = xrMode === 'ar' ? 'Enter Mixed Reality' : 'Enter Virtual Reality';
  console.log('[XRButton] Rendering button:', buttonText);

  return (
    <button
      onClick={() => onEnterXR(xrMode)}
      className="absolute bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {buttonText}
    </button>
  );
}
