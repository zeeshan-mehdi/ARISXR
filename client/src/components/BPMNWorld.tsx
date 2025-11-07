import { useBPMN } from "../lib/stores/useBPMN";
import { BPMNElement3D } from "./BPMNElement3D";
import { FlowConnection } from "./FlowConnection";
import { UserPresence } from "./UserPresence";
import { XRProcessController } from "./XRProcessController";
import { VoiceAssistant } from "./VoiceAssistant";
import { layoutBPMNElements } from "../lib/bpmnLayout";
import { useMemo, useState } from "react";
import { ElementEditor } from "./ElementEditor";
import type { XRSessionType } from "../lib/stores/useGame";

interface BPMNWorldProps {
  wsRef: React.RefObject<WebSocket | null>;
  isXR?: boolean;
  xrSessionType?: XRSessionType;
}

export function BPMNWorld({ wsRef, isXR = false, xrSessionType = null }: BPMNWorldProps) {
  const { process, selectedElement, selectElement, editingElement, setEditingElement, updateElementName, users, currentUserId } = useBPMN();
  const [editorPosition, setEditorPosition] = useState<{ x: number; y: number } | null>(null);

  const layoutNodes = useMemo(() => {
    if (!process) return new Map();
    return layoutBPMNElements(process.elements, process.flows);
  }, [process]);

  const processBounds = useMemo(() => {
    if (layoutNodes.size === 0) return { center: [0, 0, 0], size: [0, 0, 0] };
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    layoutNodes.forEach((node) => {
      const [x, y, z] = node.position;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    });
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const sizeX = maxX - minX;
    const sizeY = maxY - minY;
    const sizeZ = maxZ - minZ;
    
    return {
      center: [centerX, centerY, centerZ],
      size: [sizeX, sizeY, sizeZ]
    };
  }, [layoutNodes]);

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

  // Different positioning for different modes
  const processOffset = xrSessionType === 'vr'
    ? [-processBounds.center[0], 2.5 - processBounds.center[1], -8 - processBounds.center[2]]  // VR: Higher up on platform
    : xrSessionType === 'ar'
    ? [-processBounds.center[0], 1.2 - processBounds.center[1], -8 - processBounds.center[2]]  // AR: Original XR position
    : [0, 0, 0];  // Desktop: Origin

  // Don't add lights in VR mode (FuturisticWorld provides them)
  const shouldAddLights = xrSessionType !== 'vr';

  const ProcessContent = () => (
    <>
      {shouldAddLights && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />
        </>
      )}

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
    </>
  );

  if (isXR) {
    return (
      <XRProcessController>
        <group position={processOffset as [number, number, number]}>
          <ProcessContent />
        </group>
        <VoiceAssistant isXR={true} />
      </XRProcessController>
    );
  }

  return (
    <group position={processOffset as [number, number, number]}>
      <ProcessContent />
    </group>
  );
}
