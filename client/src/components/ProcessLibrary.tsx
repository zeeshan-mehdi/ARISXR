import { sampleProcesses } from "../data/sampleProcesses";
import { parseBPMNXML } from "../lib/bpmnParser";
import { useBPMN } from "../lib/stores/useBPMN";

interface ProcessLibraryProps {
  onProcessSelected: () => void;
}

export function ProcessLibrary({ onProcessSelected }: ProcessLibraryProps) {
  const { setProcess } = useBPMN();

  const handleSelectProcess = (xml: string) => {
    try {
      const process = parseBPMNXML(xml);
      setProcess(process);
      onProcessSelected();
    } catch (error) {
      console.error('Error loading sample process:', error);
    }
  };

  const getComplexityColor = (complexity: number) => {
    const colors = [
      'bg-green-500',
      'bg-blue-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-red-500'
    ];
    return colors[complexity - 1];
  };

  const getComplexityLabel = (complexity: number) => {
    const labels = ['Very Simple', 'Simple', 'Medium', 'Complex', 'Very Complex'];
    return labels[complexity - 1];
  };

  return (
    <div className="w-full h-full min-h-screen min-w-screen flex items-center justify-center relative overflow-hidden p-2 sm:p-4 lg:p-8"
      style={{ boxSizing: 'border-box' }}>
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 40%),
            linear-gradient(to bottom, #0f172a 0%, #1e1b4b 100%)
          `,
        }}
      />
      
      <div className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(59, 130, 246, 0.03) 2px,
            rgba(59, 130, 246, 0.03) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(59, 130, 246, 0.03) 2px,
            rgba(59, 130, 246, 0.03) 4px
          )`,
          WebkitBackdropFilter: 'blur(4px)', // fallback for Safari
          backdropFilter: 'blur(4px)', // modern browsers
          backgroundColor: 'rgba(30,27,75,0.1)', // fallback for browsers without blur
        }}
      />
      
      <div className="max-w-6xl w-full relative z-10 py-2 sm:py-4 lg:py-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="mb-3 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3">
            <div className="text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ARIS
            </div>
            <div className="h-8 sm:h-10 lg:h-12 w-1 bg-gradient-to-b from-blue-400 to-cyan-400"></div>
            <div className="text-sm sm:text-xl lg:text-2xl font-light text-blue-300">Process Intelligence</div>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
            Mixed Reality Experience
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-blue-200 mb-1 sm:mb-2">Explore BPMN Processes in Immersive 3D</p>
          <p className="text-xs sm:text-sm text-blue-300/60 flex items-center justify-center gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            Compatible with Meta Quest 3
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {sampleProcesses.map((process) => (
            <button
              key={process.id}
              onClick={() => handleSelectProcess(process.xml)}
              className="relative group bg-gradient-to-br from-blue-900/40 to-indigo-900/40 hover:from-blue-800/60 hover:to-indigo-800/60 border border-blue-500/30 hover:border-blue-400/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>
              
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">{process.name}</h3>
                <div className={`${getComplexityColor(process.complexity)} w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg flex-shrink-0`}>
                  {process.complexity}
                </div>
              </div>
              
              <p className="text-blue-200/70 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 leading-relaxed">{process.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-300/60 uppercase tracking-wider font-medium">
                  {getComplexityLabel(process.complexity)}
                </span>
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-cyan-400 transition-colors group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-4 sm:mt-6 lg:mt-10">
          <div className="inline-block bg-blue-950/50 border border-blue-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 backdrop-blur-sm">
            <p className="text-blue-200/80 text-xs sm:text-sm flex items-center gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Or upload your own BPMN file using the upload button
            </p>
          </div>
        </div>
        
        <div className="text-center mt-3 sm:mt-4 lg:mt-6 text-xs text-blue-300/40 mb-4">
          Powered by ARIS Process Intelligence Platform
        </div>
      </div>
    </div>
  );
}
