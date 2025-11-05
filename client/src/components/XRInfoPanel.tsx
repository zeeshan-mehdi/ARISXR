import { Html } from '@react-three/drei';
import type { BPMNElement } from '../lib/bpmnParser';

interface XRInfoPanelProps {
  element: BPMNElement;
}

export function XRInfoPanel({ element }: XRInfoPanelProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'startEvent': 'Start Event',
      'endEvent': 'End Event',
      'task': 'Task',
      'exclusiveGateway': 'Decision Gateway',
      'parallelGateway': 'Parallel Gateway',
    };
    return labels[type] || type;
  };

  return (
    <Html
      position={[0, 2, 0]}
      center
      distanceFactor={3}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div className="bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-lg border border-purple-500/50 shadow-xl min-w-[200px]">
        <h3 className="text-sm font-bold text-purple-400 mb-1">{element.name}</h3>
        <p className="text-xs text-gray-400">Type: {getTypeLabel(element.type)}</p>
        {element.id && (
          <p className="text-xs text-gray-500 mt-1">ID: {element.id}</p>
        )}
      </div>
    </Html>
  );
}
