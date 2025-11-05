import { useBPMN } from "../lib/stores/useBPMN";
import { BPMNElement3D } from "./BPMNElement3D";
import { FlowConnection } from "./FlowConnection";
import { UserPresence } from "./UserPresence";
import { layoutBPMNElements } from "../lib/bpmnLayout";
import { useMemo, useState } from "react";
import { ElementEditor } from "./ElementEditor";

interface BPMNWorldProps {
  wsRef: React.RefObject<WebSocket | null>;
  isXR?: boolean;
}

export function BPMNWorld({ wsRef, isXR = false }: BPMNWorldProps) {
  const { process, selectedElement, selectElement, editingElement, setEditingElement, updateElementName, users, currentUserId } = useBPMN();
  const [editorPosition, setEditorPosition] = useState<{ x: number; y: number } | null>(null);

  const layoutNodes = useMemo(() => {
    if (!process) return new Map();
    return layoutBPMNElements(process.elements, process.flows);
  }, [process]);

  const handleElementDoubleClick = (element: any, screenPos: { x: number; y: number }) => {
    if (isXR) return;
    selectElement(element);
    setEditingElement(element);
    setEditorPosition(screenPos);
  };

  const handleSaveEdit = (elementId: string, newName: string) => {
    updateElementName(elementId, newName);
    setEditorPosition(null);
  };

  const handleCancelEdit = () => {
    setEditingElement(null);
    setEditorPosition(null);
  };

  if (!process) {
    return null;
  }

  const processOffset = isXR ? [0, 1.2, -5] : [0, 0, 0];

  return (
    <group position={processOffset as [number, number, number]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />

      {process.elements.map((element) => {
        const node = layoutNodes.get(element.id);
        if (!node) return null;

        return (
          <BPMNElement3D
            key={element.id}
            element={element}
            position={node.position}
            isSelected={selectedElement?.id === element.id}
            onClick={() => selectElement(element)}
            onDoubleClick={(screenPos) => handleElementDoubleClick(element, screenPos)}
          />
        );
      })}

      {process.flows.map((flow) => {
        const sourceNode = flow.sourceRef ? layoutNodes.get(flow.sourceRef) : undefined;
        const targetNode = flow.targetRef ? layoutNodes.get(flow.targetRef) : undefined;
        
        return (
          <FlowConnection
            key={flow.id}
            flow={flow}
            sourceNode={sourceNode}
            targetNode={targetNode}
          />
        );
      })}

      {users.filter(u => u.id !== currentUserId).map((user) => (
        <UserPresence key={user.id} user={user} />
      ))}

      {!isXR && editingElement && editorPosition && (
        <ElementEditor
          element={editingElement}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          position={editorPosition}
        />
      )}
    </group>
  );
}
