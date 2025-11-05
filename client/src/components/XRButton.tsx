import { useEffect, useState } from 'react';

interface XRButtonProps {
  onEnterXR: () => void;
  isInXR: boolean;
}

export function XRButton({ onEnterXR, isInXR }: XRButtonProps) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      if ('xr' in navigator && navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsSupported(supported);
        } catch (error) {
          console.error('XR support check failed:', error);
          setIsSupported(false);
        }
      }
    };
    checkSupport();
  }, []);

  if (!isSupported || isInXR) {
    return null;
  }

  return (
    <button
      onClick={onEnterXR}
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
      Enter Mixed Reality
    </button>
  );
}
