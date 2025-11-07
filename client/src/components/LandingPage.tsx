import { Canvas } from '@react-three/fiber';
import { RobotScene } from './RobotScene';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="w-full h-full min-h-screen min-w-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with light points */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(142, 60, 247, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(142, 60, 247, 0.35) 0%, transparent 40%),
            radial-gradient(circle at 40% 70%, rgba(142, 60, 247, 0.38) 0%, transparent 45%),
            radial-gradient(circle at 90% 80%, rgba(142, 60, 247, 0.3) 0%, transparent 35%),
            radial-gradient(circle at 60% 50%, rgba(142, 60, 247, 0.25) 0%, transparent 55%),
            #1a0b2e
          `,
        }}
      />

      {/* Three.js Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [-5, 3, 10], fov: 45, near: 0.25, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ camera }) => {
            camera.lookAt(0, 2, 0);
          }}
        >
          <RobotScene />
        </Canvas>
      </div>

      {/* Welcome text - top */}
      <div className="fixed top-[60px] left-0 right-0 w-full text-center z-10 pointer-events-none">
        <p className="font-['Roboto'] text-[64px] text-white m-0 p-0">
          <span className="font-thin">Welcome to </span>
          <span className="font-thin">ARIS</span>
        </p>
      </div>

      {/* Process Intelligence text - bottom */}
      <div className="fixed bottom-[100px] left-0 right-0 w-full text-center z-10 pointer-events-none">
        <p className="font-['Roboto'] text-[46px] text-white m-0 p-0">
          <span className="font-normal">Mixed Reality Experience</span>
        </p>
      </div>

      {/* Enter button */}
      <button
        onClick={onEnter}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 bg-[#1a0b2e] hover:bg-[#2d1b4e] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-800"
      >
        Enter Experience
      </button>
    </div>
  );
}
