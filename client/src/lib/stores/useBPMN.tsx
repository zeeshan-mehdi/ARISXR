import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { BPMNProcess, BPMNElement } from "../bpmnParser";

export interface User {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
}

interface BPMNState {
  process: BPMNProcess | null;
  selectedElement: BPMNElement | null;
  editingElement: BPMNElement | null;
  users: User[];
  currentUserId: string;
  
  setProcess: (process: BPMNProcess | null) => void;
  selectElement: (element: BPMNElement | null) => void;
  setEditingElement: (element: BPMNElement | null) => void;
  updateElementName: (elementId: string, newName: string) => void;
  setUsers: (users: User[]) => void;
  updateUserPosition: (userId: string, position: [number, number, number]) => void;
  setCurrentUserId: (id: string) => void;
}

export const useBPMN = create<BPMNState>()(
  subscribeWithSelector((set) => ({
    process: null,
    selectedElement: null,
    editingElement: null,
    users: [],
    currentUserId: '',
    
    setProcess: (process) => {
      console.log('Setting BPMN process:', process?.name ?? 'null');
      set({ process, selectedElement: null, editingElement: null });
    },
    
    selectElement: (element) => {
      console.log('Selected element:', element?.id);
      set({ selectedElement: element });
    },
    
    setEditingElement: (element) => {
      console.log('Editing element:', element?.id);
      set({ editingElement: element });
    },
    
    updateElementName: (elementId, newName) => {
      console.log('Updating element name:', elementId, newName);
      set((state) => {
        if (!state.process) return {};
        
        const updatedElements = state.process.elements.map(el =>
          el.id === elementId ? { ...el, name: newName } : el
        );
        
        return {
          process: {
            ...state.process,
            elements: updatedElements,
          },
          editingElement: null,
          selectedElement: state.selectedElement?.id === elementId
            ? { ...state.selectedElement, name: newName }
            : state.selectedElement,
        };
      });
    },
    
    setUsers: (users) => {
      set({ users });
    },
    
    updateUserPosition: (userId, position) => {
      set((state) => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, position } : user
        ),
      }));
    },
    
    setCurrentUserId: (id) => {
      set({ currentUserId: id });
    },
  }))
);
