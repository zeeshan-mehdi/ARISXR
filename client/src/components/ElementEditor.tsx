import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Check, X } from "lucide-react";
import type { BPMNElement } from "../lib/bpmnParser";

interface ElementEditorProps {
  element: BPMNElement;
  onSave: (elementId: string, newName: string) => void;
  onCancel: () => void;
  position: { x: number; y: number };
}

export function ElementEditor({ element, onSave, onCancel, position }: ElementEditorProps) {
  const [name, setName] = useState(element.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSave = () => {
    if (name.trim() && name !== element.name) {
      onSave(element.id, name.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="absolute z-20"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Card className="bg-gray-900/95 border-gray-700 shadow-2xl">
        <CardContent className="pt-4 pb-3 px-3">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-64 bg-gray-800 border-gray-600 text-white"
              placeholder="Enter element name..."
            />
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-3"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-white px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Press Enter to save, Escape to cancel</p>
        </CardContent>
      </Card>
    </div>
  );
}
