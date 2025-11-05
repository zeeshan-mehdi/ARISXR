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
  users: User[];
  currentUserId: string;
  
  setProcess: (process: BPMNProcess) => void;
  selectElement: (element: BPMNElement | null) => void;
  setUsers: (users: User[]) => void;
  updateUserPosition: (userId: string, position: [number, number, number]) => void;
  setCurrentUserId: (id: string) => void;
}

export const useBPMN = create<BPMNState>()(
  subscribeWithSelector((set) => ({
    process: null,
    selectedElement: null,
    users: [],
    currentUserId: '',
    
    setProcess: (process) => {
      console.log('Setting BPMN process:', process.name);
      set({ process, selectedElement: null });
    },
    
    selectElement: (element) => {
      console.log('Selected element:', element?.id);
      set({ selectedElement: element });
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
