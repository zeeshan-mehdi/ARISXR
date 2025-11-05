import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { useBPMN } from "../lib/stores/useBPMN";
import { BPMNElement3D } from "./BPMNElement3D";
import { FlowConnection } from "./FlowConnection";
import { UserPresence } from "./UserPresence";
import { CameraTracker } from "./CameraTracker";
import { ElementEditor } from "./ElementEditor";
import { layoutBPMNElements } from "../lib/bpmnLayout";
import { useMemo, useState } from "react";

interface BPMNSceneProps {
  wsRef: React.RefObject<WebSocket | null>;
}

export function BPMNScene({ wsRef }: BPMNSceneProps) {
  const { process, selectedElement, selectElement, editingElement, setEditingElement, updateElementName, users, currentUserId } = useBPMN();
  const [editorPosition, setEditorPosition] = useState<{ x: number; y: number } | null>(null);

  const layoutNodes = useMemo(() => {
    if (!process) return new Map();
    return layoutBPMNElements(process.elements, process.flows);
  }, [process]);

  const handleElementDoubleClick = (element: any, screenPos: { x: number; y: number }) => {
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
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">No Process Loaded</h2>
          <p className="text-gray-400">Upload a BPMN file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Canvas shadows>
        <color attach="background" args={["#1a1a2e"]} />
      
      <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={60} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2}
      />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4A90E2" />
      <pointLight position={[10, 5, 10]} intensity={0.3} color="#F5A623" />

      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#333366"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#4444AA"
        fadeDistance={30}
        fadeStrength={1}
        position={[0, -0.01, 0]}
      />

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
        
        <CameraTracker wsRef={wsRef} />
      </Canvas>

      {editingElement && editorPosition && (
        <ElementEditor
          element={editingElement}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          position={editorPosition}
        />
      )}
    </>
  );
}
