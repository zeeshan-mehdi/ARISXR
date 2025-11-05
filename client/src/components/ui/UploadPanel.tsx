import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { parseBPMNXML, createSampleBPMN } from "../../lib/bpmnParser";
import { useBPMN } from "../../lib/stores/useBPMN";

export function UploadPanel() {
  const { process, setProcess } = useBPMN();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    
    try {
      const text = await file.text();
      const parsedProcess = parseBPMNXML(text);
      setProcess(parsedProcess);
    } catch (err) {
      console.error('Error parsing BPMN:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse BPMN file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const loadSampleProcess = () => {
    setError(null);
    try {
      const sampleXML = createSampleBPMN();
      const parsedProcess = parseBPMNXML(sampleXML);
      setProcess(parsedProcess);
    } catch (err) {
      console.error('Error loading sample:', err);
      setError('Failed to load sample process');
    }
  };

  if (process) {
    return (
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-gray-900/95 border-gray-700 text-white shadow-lg">
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <div>
                <p className="font-semibold text-sm">{process.name}</p>
                <p className="text-xs text-gray-400">
                  {process.elements.length} elements, {process.flows.length} flows
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
            >
              Load Different Process
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".bpmn,.xml"
              onChange={handleFileInput}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-b from-gray-900 to-gray-800">
      <Card className="w-full max-w-lg mx-4 bg-gray-800/95 border-gray-700 shadow-2xl">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">3D BPMN Visualizer</h1>
            <p className="text-gray-400">Upload a BPMN process to visualize in 3D</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-white mb-2 font-medium">Drop your BPMN file here</p>
            <p className="text-sm text-gray-400 mb-4">or</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Files
            </Button>
            <p className="text-xs text-gray-500 mt-3">Supports .bpmn and .xml files</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".bpmn,.xml"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">OR</span>
            </div>
          </div>

          <Button
            onClick={loadSampleProcess}
            variant="outline"
            className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
          >
            Load Sample Process
          </Button>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700 rounded text-red-200 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
