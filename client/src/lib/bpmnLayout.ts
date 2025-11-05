import type { BPMNElement } from "./bpmnParser";

export interface LayoutNode {
  id: string;
  element: BPMNElement;
  position: [number, number, number];
  level: number;
}

export function layoutBPMNElements(elements: BPMNElement[], flows: BPMNElement[]): Map<string, LayoutNode> {
  const nodes = new Map<string, LayoutNode>();
  
  const levelMap = new Map<string, number>();
  const visited = new Set<string>();
  
  const findStartEvents = () => {
    return elements.filter(el => el.type === 'startEvent');
  };
  
  const assignLevels = (elementId: string, level: number) => {
    if (visited.has(elementId)) return;
    visited.add(elementId);
    
    const currentLevel = levelMap.get(elementId) || 0;
    levelMap.set(elementId, Math.max(currentLevel, level));
    
    const outgoingFlows = flows.filter(f => f.sourceRef === elementId);
    outgoingFlows.forEach(flow => {
      if (flow.targetRef) {
        assignLevels(flow.targetRef, level + 1);
      }
    });
  };
  
  const startEvents = findStartEvents();
  if (startEvents.length === 0 && elements.length > 0) {
    assignLevels(elements[0].id, 0);
  } else {
    startEvents.forEach(start => assignLevels(start.id, 0));
  }
  
  const elementsByLevel = new Map<number, BPMNElement[]>();
  elements.forEach(el => {
    const level = levelMap.get(el.id) || 0;
    if (!elementsByLevel.has(level)) {
      elementsByLevel.set(level, []);
    }
    elementsByLevel.get(level)!.push(el);
  });
  
  const horizontalSpacing = 3;
  const verticalSpacing = 2;
  
  elements.forEach(el => {
    const level = levelMap.get(el.id) || 0;
    const elementsAtLevel = elementsByLevel.get(level) || [];
    const indexAtLevel = elementsAtLevel.indexOf(el);
    
    const totalAtLevel = elementsAtLevel.length;
    const verticalOffset = (indexAtLevel - (totalAtLevel - 1) / 2) * verticalSpacing;
    
    const position: [number, number, number] = [
      level * horizontalSpacing,
      verticalOffset,
      0
    ];
    
    nodes.set(el.id, {
      id: el.id,
      element: el,
      position,
      level,
    });
  });
  
  return nodes;
}
