export function XRInstructions() {
  return (
    <div className="absolute top-20 left-4 z-40 bg-gray-900/90 backdrop-blur-sm text-white p-4 rounded-lg border border-purple-500/30 max-w-md">
      <h3 className="text-lg font-bold mb-2 text-purple-400">🥽 Meta Quest 3 Instructions</h3>
      <ol className="text-sm space-y-2 list-decimal list-inside">
        <li>Open this page on your <strong>Meta Quest 3</strong> browser</li>
        <li>Select a BPMN process from the library</li>
        <li>Click <strong>"Enter Mixed Reality"</strong> button</li>
        <li>Allow browser permissions when prompted</li>
        <li>The process will appear <strong>5 meters in front of you</strong> at eye level!</li>
      </ol>
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          <strong>Left Joystick:</strong> Move the process left/right/forward/back
        </p>
        <p className="text-xs text-gray-400 mt-1">
          <strong>Right Joystick:</strong> Rotate left/right (horizontal) or zoom in/out (vertical)
        </p>
        <p className="text-xs text-gray-400 mt-2">
          <strong>Physical Movement:</strong> You can also walk around the process within your guardian boundary!
        </p>
      </div>
    </div>
  );
}
