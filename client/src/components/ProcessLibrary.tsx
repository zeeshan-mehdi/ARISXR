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
      'bg-purple-400',   // Very Simple - light purple
      'bg-purple-500',   // Simple - medium-light purple
      'bg-purple-600',   // Medium - medium purple
      'bg-purple-700',   // Complex - medium-dark purple
      'bg-purple-900'    // Very Complex - dark purple
    ];
    return colors[complexity - 1];
  };

  const getComplexityLabel = (complexity: number) => {
    const labels = ['Very Simple', 'Simple', 'Medium', 'Complex', 'Very Complex'];
    return labels[complexity - 1];
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-center relative overflow-y-auto overflow-x-hidden p-2 sm:p-4 lg:p-8 pt-4 sm:pt-6 lg:pt-8"
      style={{ boxSizing: 'border-box' }}>
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

      <div className="max-w-6xl w-full relative z-10 py-0 sm:py-2 lg:py-4">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <div className="mb-4 sm:mb-6 lg:mb-8 flex items-center justify-center gap-2 sm:gap-3">
            <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white">
              ARIS
            </div>
            <div className="h-8 sm:h-10 lg:h-12 w-1 bg-white"></div>
            <div className="text-sm sm:text-xl lg:text-2xl font-light text-white">Process Intelligence</div>
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
            Mixed Reality Experience
          </h1>
          <p className="text-xs sm:text-base lg:text-lg text-blue-200 mb-1 sm:mb-2">Explore BPMN Processes in Immersive 3D</p>
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
              className="relative group bg-[#1a0b2e]/90 hover:bg-[#1a0b2e]/90 border border-purple-700/40 hover:border-purple-500/60 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-left transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-black/60 hover:shadow-2xl hover:shadow-black/80 backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#8E3CF7] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>
              
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
