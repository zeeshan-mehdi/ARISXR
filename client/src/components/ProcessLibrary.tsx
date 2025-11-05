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
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">3D BPMN Visualizer</h1>
          <p className="text-xl text-gray-300">Choose a sample process to explore in 3D</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProcesses.map((process) => (
            <button
              key={process.id}
              onClick={() => handleSelectProcess(process.xml)}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg p-6 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-white">{process.name}</h3>
                <div className={`${getComplexityColor(process.complexity)} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                  {process.complexity}
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{process.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {getComplexityLabel(process.complexity)}
                </span>
                <svg 
                  className="w-5 h-5 text-gray-500"
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

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Or upload your own BPMN file using the upload button in the top right
          </p>
        </div>
      </div>
    </div>
  );
}
