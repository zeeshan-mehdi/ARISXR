import { X } from "lucide-react";
import { useBPMN } from "../../lib/stores/useBPMN";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

export function InfoPanel() {
  const { selectedElement, selectElement } = useBPMN();

  if (!selectedElement) return null;

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'startEvent':
        return 'bg-green-500 hover:bg-green-600';
      case 'endEvent':
        return 'bg-red-500 hover:bg-red-600';
      case 'task':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'gateway':
        return 'bg-orange-500 hover:bg-orange-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatType = (type: string) => {
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[80vh] overflow-auto z-10">
      <Card className="bg-gray-900/95 border-gray-700 text-white shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-bold">Element Details</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectElement(null)}
            className="h-6 w-6 p-0 hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Type</label>
            <div className="mt-1">
              <Badge className={getTypeBadgeColor(selectedElement.type)}>
                {formatType(selectedElement.type)}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Name</label>
            <p className="mt-1 text-base font-medium">{selectedElement.name}</p>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">ID</label>
            <p className="mt-1 text-sm font-mono text-gray-300">{selectedElement.id}</p>
          </div>

          {selectedElement.incoming && selectedElement.incoming.length > 0 && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Incoming Flows</label>
              <div className="mt-1 space-y-1">
                {selectedElement.incoming.map((flow, idx) => (
                  <p key={idx} className="text-sm text-gray-300 font-mono">
                    {flow}
                  </p>
                ))}
              </div>
            </div>
          )}

          {selectedElement.outgoing && selectedElement.outgoing.length > 0 && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Outgoing Flows</label>
              <div className="mt-1 space-y-1">
                {selectedElement.outgoing.map((flow, idx) => (
                  <p key={idx} className="text-sm text-gray-300 font-mono">
                    {flow}
                  </p>
                ))}
              </div>
            </div>
          )}

          {selectedElement.attributes && Object.keys(selectedElement.attributes).length > 0 && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
                Additional Attributes
              </label>
              <div className="bg-gray-800/50 rounded p-3 space-y-2 max-h-60 overflow-auto">
                {Object.entries(selectedElement.attributes)
                  .filter(([key]) => !key.startsWith('@_') && key !== '#text')
                  .map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="text-gray-400">{key}:</span>{' '}
                      <span className="text-gray-200">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
