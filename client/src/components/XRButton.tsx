import { useEffect, useState } from 'react';

interface XRButtonProps {
  onEnterXR: (mode: 'ar' | 'vr') => void;
  isInXR: boolean;
}

export function XRButton({ onEnterXR, isInXR }: XRButtonProps) {
  const [xrMode, setXrMode] = useState<'ar' | 'vr' | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      if ('xr' in navigator && navigator.xr) {
        try {
          // Check AR support first (Meta Quest 3)
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
          if (arSupported) {
            console.log('XR Mode: immersive-ar (Meta Quest 3)');
            setXrMode('ar');
            return;
          }
          
          // Check VR support (Apple Vision Pro)
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
          if (vrSupported) {
            console.log('XR Mode: immersive-vr (Apple Vision Pro)');
            setXrMode('vr');
            return;
          }
          
          console.log('No XR support detected');
          setXrMode(null);
        } catch (error) {
          console.error('XR support check failed:', error);
          setXrMode(null);
        }
      }
    };
    checkSupport();
  }, []);

  if (!xrMode || isInXR) {
    return null;
  }

  const buttonText = xrMode === 'ar' ? 'Enter Mixed Reality' : 'Enter Virtual Reality';

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
