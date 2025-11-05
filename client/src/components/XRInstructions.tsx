export function XRInstructions() {
  return (
    <div className="absolute top-20 left-4 z-40 bg-gray-900/90 backdrop-blur-sm text-white p-4 rounded-lg border border-purple-500/30 max-w-md">
      <h3 className="text-lg font-bold mb-2 text-purple-400">🥽 Meta Quest 3 Instructions</h3>
      <ol className="text-sm space-y-2 list-decimal list-inside">
        <li>Open this page on your <strong>Meta Quest 3</strong> browser</li>
        <li>Select a BPMN process from the library</li>
        <li>Click <strong>"Enter Mixed Reality"</strong> button</li>
        <li>Allow browser permissions when prompted</li>
        <li>Your BPMN process will overlay on your real environment!</li>
      </ol>
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          <strong>Controls:</strong> Point at elements with your controllers to select them. 
          Walk around to view from different angles. Double-click with your controller to rename elements.
        </p>
      </div>
    </div>
  );
}
