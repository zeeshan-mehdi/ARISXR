import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Html, Text } from '@react-three/drei';
import { useBPMN } from '../lib/stores/useBPMN';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import type { BPMNElement } from '../lib/bpmnParser';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useXRInput } from '../lib/useXRInput';

interface VoiceAssistantProps {
  isXR?: boolean;
}

const VoiceAssistantVR = memo(function VoiceAssistantVR({
  isListening,
  isSpeaking,
  transcript,
  response,
  onStartListening,
  onStopListening,
  onToggleListening,
  onStopSpeaking
}: {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  response: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const xrInput = useXRInput();

  // Version marker for VR component
  useEffect(() => {
    console.log('🎮🎮🎮 VoiceAssistantVR (XR) LOADED - VERSION: 2025-11-06-FIX-v6-ABORT 🎮🎮🎮');
    console.log('✅ resetRecognitionState now ABORTS browser recognition instance');
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log('[VoiceAssistantVR] State changed:', { isListening, isSpeaking });
  }, [isListening, isSpeaking]);

  // Store callbacks in refs to avoid re-registering handlers
  const startListeningRef = useRef(onStartListening);
  const stopListeningRef = useRef(onStopListening);

  useEffect(() => {
    startListeningRef.current = onStartListening;
  }, [onStartListening]);

  useEffect(() => {
    stopListeningRef.current = onStopListening;
  }, [onStopListening]);

  useEffect(() => {
    console.log('[VoiceAssistantVR] 🎯 Registering HOLD-TO-SPEAK button handlers');

    const handlePressDown = () => {
      console.log('[VoiceAssistantVR] 🎤 Trigger PRESSED DOWN - starting listening');
      startListeningRef.current();
    };

    const handleRelease = () => {
      console.log('[VoiceAssistantVR] 🛑 Trigger RELEASED - stopping listening');
      stopListeningRef.current();
    };

    const leftId = xrInput.registerButtonHold('leftTrigger', handlePressDown, handleRelease);
    const rightId = xrInput.registerButtonHold('rightTrigger', handlePressDown, handleRelease);

    return () => {
      console.log('[VoiceAssistantVR] ⚠️ Component unmounting - unregistering hold handlers');
      xrInput.unregisterButtonHold(leftId);
      xrInput.unregisterButtonHold(rightId);
    };
  }, [xrInput]);
  
  // Animate the sphere in VR - enhanced animation when listening
  useFrame((state) => {
    if (sphereRef.current) {
      const time = state.clock.getElapsedTime();

      if (isListening) {
        // More intense animation when listening
        sphereRef.current.position.y = 1.5 + Math.sin(time * 5) * 0.15;
        sphereRef.current.rotation.y = time * 1.5;
        // Pulse scale
        const scale = 1 + Math.sin(time * 4) * 0.1;
        sphereRef.current.scale.set(scale, scale, scale);
      } else {
        // Normal gentle animation
        sphereRef.current.position.y = 1.5 + Math.sin(time * 2) * 0.1;
        sphereRef.current.rotation.y = time * 0.5;
        sphereRef.current.scale.set(1, 1, 1);
      }
    }
  });
  
  const assistantColor = isListening ? '#ef4444' : isSpeaking ? '#fb923c' : '#06b6d4';
  
  return (
    <group position={[3, 0, -2]}>
      <mesh 
        ref={sphereRef} 
        position={[0, 1.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Voice Assistant sphere clicked in VR');
          onToggleListening();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color={assistantColor}
          emissive={assistantColor}
          emissiveIntensity={isListening || isSpeaking ? 1.5 : (hovered ? 1.2 : 0.8)}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      <mesh position={[0, 1.5, 0]} scale={isListening || isSpeaking ? 1.3 : 1.0}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshBasicMaterial 
          color={assistantColor}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      
      <Text
        position={[0, 2.0, 0]}
        fontSize={0.2}
        color="#00d9ff"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        ARIS AI
      </Text>
      
      <Text
        position={[0, 1.75, 0]}
        fontSize={0.12}
        color={assistantColor}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
      </Text>
      
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.65, 32]} />
        <meshBasicMaterial
          color={assistantColor}
          transparent
          opacity={isListening ? 0.7 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Instruction text */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
        maxWidth={2}
      >
        {isListening ? 'Keep holding... speak now!' : isSpeaking ? 'AI is responding...' : 'HOLD trigger to speak'}
      </Text>
      
      {/* Transcript display */}
      {transcript && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.09}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
          maxWidth={2.5}
        >
          You: {transcript}
        </Text>
      )}
      
      {/* Response display */}
      {response && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.09}
          color="#4caf50"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.015}
          outlineColor="#000000"
          maxWidth={2.5}
        >
          AI: {response}
        </Text>
      )}
    </group>
  );
});

export function VoiceAssistant({ isXR = false }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef(false);
  const isStoppingRef = useRef(false); // NEW: track if we're waiting for onend
  const onendTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Fallback timeout
  const { process } = useBPMN();
  const elements = process?.elements || [];

  // Version marker to verify code updates
  useEffect(() => {
    console.log('🚀🚀🚀 VoiceAssistant LOADED - VERSION: 2025-11-06-FIX-v6-ABORT 🚀🚀🚀');
    console.log('✅ resetRecognitionState ABORTS browser recognition to fix "already started" error');
  }, []);

  // Helper function to reset all recognition state
  const resetRecognitionState = useCallback((reason: string) => {
    console.log(`[VoiceAssistantVR] 🔄 RESETTING STATE - Reason: ${reason}`);

    // Clear timeout if exists
    if (onendTimeoutRef.current) {
      clearTimeout(onendTimeoutRef.current);
      onendTimeoutRef.current = null;
      console.log('[VoiceAssistantVR] ⏰ Cleared onend timeout');
    }

    // CRITICAL: Abort the recognition instance to truly stop the browser's speech recognition
    if (recognitionRef.current && (isActiveRef.current || isStoppingRef.current)) {
      try {
        console.log('[VoiceAssistantVR] 🛑 Aborting recognition instance in browser');
        recognitionRef.current.abort();
      } catch (e) {
        console.warn('[VoiceAssistantVR] ⚠️ Abort failed (may already be stopped):', e);
      }
    }

    isActiveRef.current = false;
    isStoppingRef.current = false;
    setIsListening(false);
    console.log('[VoiceAssistantVR] ✅ State reset complete - ready for next activation');
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('[VoiceAssistantVR] SpeechRecognition not supported');
      return;
    }

    console.log('[VoiceAssistantVR] Creating SINGLE recognition instance');
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('[VoiceAssistantVR] 🎤 onstart - recognition started');
      isActiveRef.current = true;
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      console.log('[VoiceAssistantVR] onresult:', { transcript, isFinal: event.results[current].isFinal });
      setTranscript(transcript);

      if (event.results[current].isFinal) {
        console.log('[VoiceAssistantVR] 🗣️ Final transcript received');
        console.log('[VoiceAssistantVR] 📝 User said:', transcript);
        handleVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('[VoiceAssistantVR] ❌ onerror:', event.error);

      // Handle no-speech or other errors by resetting state
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        console.log('[VoiceAssistantVR] 🔇 No speech detected or audio issue - resetting state');
        resetRecognitionState('onerror: ' + event.error);
      } else if (event.error !== 'aborted') {
        resetRecognitionState('onerror: ' + event.error);
      }
    };

    recognition.onend = () => {
      console.log('[VoiceAssistantVR] 💚 onend - recognition ended');
      resetRecognitionState('onend fired');
    };

    recognitionRef.current = recognition;

    return () => {
      console.log('[VoiceAssistantVR] Component cleanup');
      if (onendTimeoutRef.current) {
        clearTimeout(onendTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          isActiveRef.current = false;
        } catch (e) {
          console.warn('[VoiceAssistantVR] Cleanup abort failed:', e);
        }
      }
    };
  }, [resetRecognitionState]);

  // Separate effect to handle the onresult callback with latest dependencies
  useEffect(() => {
    console.log('[VoiceAssistantVR] 🔄 Updating onresult callback with latest process data');
    console.log('[VoiceAssistantVR] Process:', process?.name || 'No process');
    console.log('[VoiceAssistantVR] Elements count:', elements.length);

    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: any) => {
        console.log('[VoiceAssistantVR] 📝 Recognition result event:', event);
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        const isFinal = event.results[current].isFinal;

        console.log('[VoiceAssistantVR] Transcript:', transcript);
        console.log('[VoiceAssistantVR] Is final:', isFinal);

        setTranscript(transcript);

        if (isFinal) {
          console.log('[VoiceAssistantVR] ✅ Final transcript received, processing command...');
          handleVoiceCommand(transcript);
        }
      };
      console.log('[VoiceAssistantVR] ✅ onresult callback updated successfully');
    } else {
      console.warn('[VoiceAssistantVR] ⚠️ recognitionRef.current is null, cannot update callback');
    }
  }, [process, elements]);

  const handleVoiceCommand = async (text: string) => {
    console.log('[VoiceAssistantVR] 💬 Processing voice command:', text);

    // Build process context
    const processContext = `
Process: ${process?.name || 'Unnamed Process'}
Elements: ${elements.map((el: BPMNElement) => `${el.type}: ${el.name}${el.description ? ` - ${el.description}` : ''}`).join(', ')}
Total Elements: ${elements.length}
    `.trim();

    console.log('[VoiceAssistantVR] 📤 Sending to API:', { processContext, question: text });

    try {
      console.log('[VoiceAssistantVR] 🌐 Sending request to /api/chat...');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processContext,
          question: text
        })
      });

      console.log('[VoiceAssistantVR] 📥 API response status:', res.status);
      const data = await res.json();
      console.log('[VoiceAssistantVR] 📦 API response data:', data);

      if (data.answer) {
        console.log('[VoiceAssistantVR] 🤖 AI Answer:', data.answer);
        setResponse(data.answer);
        speak(data.answer);
      } else if (data.error) {
        console.error('[VoiceAssistantVR] ❌ API error:', data.error);
        setResponse(`Error: ${data.error}`);
        speak(`Sorry, I encountered an error: ${data.error}`);
      } else {
        console.warn('[VoiceAssistantVR] ⚠️ Unexpected response format:', data);
      }
    } catch (error) {
      console.error('[VoiceAssistantVR] ❌ Error sending voice command:', error);
      setResponse('Failed to get response from AI');
      speak('Sorry, I could not process your request.');
    }
    console.log('[VoiceAssistantVR] ========== END PROCESSING ==========');
  };

  const speak = (text: string) => {
    console.log('[VoiceAssistantVR] 🔊 Speaking:', text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('[VoiceAssistantVR] 🗣️ Speech synthesis STARTED');
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        console.log('[VoiceAssistantVR] ✅ Speech synthesis ENDED');
        setIsSpeaking(false);
      };
      utterance.onerror = (e) => {
        console.error('[VoiceAssistantVR] ❌ Speech synthesis ERROR:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('[VoiceAssistantVR] ⚠️ Speech synthesis not supported');
    }
  };

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('[VoiceAssistantVR] ❌ No recognition instance available');
      return;
    }

    // Check if we're still stopping from previous session
    if (isStoppingRef.current) {
      console.warn('[VoiceAssistantVR] 🔄 Still stopping from previous session - wait for reset');
      return;
    }

    if (isActiveRef.current) {
      console.warn('[VoiceAssistantVR] ⚠️ Already listening, ignoring start request');
      return;
    }

    console.log('[VoiceAssistantVR] 💙 STARTING recognition (hold-to-speak)...');
    console.log('[VoiceAssistantVR] 🔄 Clearing previous transcript and response');
    setTranscript('');
    setResponse('');

    try {
      recognitionRef.current.start();
      console.log('[VoiceAssistantVR] ✅ Recognition start() called successfully');
    } catch (error: any) {
      console.error('[VoiceAssistantVR] ❌ Start failed:', error);
      // Reset state on error
      resetRecognitionState('start() error');
    }
  }, [resetRecognitionState]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('[VoiceAssistantVR] ❌ No recognition instance available');
      return;
    }

    if (!isActiveRef.current) {
      console.log('[VoiceAssistantVR] ⚠️ Not listening, ignoring stop request');
      return;
    }

    console.log('[VoiceAssistantVR] 💛 STOPPING recognition (hold-to-speak released)');
    try {
      // Set stopping flag BEFORE calling stop()
      isStoppingRef.current = true;
      console.log('[VoiceAssistantVR] 🚫 Set isStoppingRef = true (blocks new starts until onend)');

      // Use stop() to process audio - onend will fire later
      recognitionRef.current.stop();
      console.log('[VoiceAssistantVR] ✅ Recognition stop() called - waiting for onresult + onend...');

      // CRITICAL FIX: Set timeout fallback in case onend never fires
      // If we have a transcript when timeout fires, PROCESS IT!
      onendTimeoutRef.current = setTimeout(() => {
        console.warn('[VoiceAssistantVR] ⏰ TIMEOUT - onend did not fire after 3 seconds');

        // Check if we have any transcript (even interim)
        const currentTranscript = transcript.trim();
        if (currentTranscript) {
          console.log('[VoiceAssistantVR] 💬 Found transcript during timeout, processing it:', currentTranscript);
          handleVoiceCommand(currentTranscript);
        } else {
          console.log('[VoiceAssistantVR] 🔇 No transcript captured, skipping AI request');
        }

        // Reset state after processing (or if no transcript)
        resetRecognitionState('timeout - forced completion');
      }, 3000);
      console.log('[VoiceAssistantVR] ⏰ Set 3-second timeout fallback (will process transcript if available)');
    } catch (error) {
      console.error('[VoiceAssistantVR] ❌ Stop failed:', error);
      resetRecognitionState('stop() error');
    }
  }, [resetRecognitionState, transcript, handleVoiceCommand]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('[VoiceAssistantVR] ❌ No recognition instance available');
      alert('Voice recognition is not supported in your browser');
      return;
    }

    console.log('[VoiceAssistantVR] 🎤 toggleListening called', {
      isActive: isActiveRef.current,
      isListening
    });

    if (isActiveRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const panelContent = (
    <div className="bg-gradient-to-br from-blue-900/95 to-indigo-900/95 backdrop-blur-md border-2 border-blue-400/40 rounded-xl p-4 shadow-2xl max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-400' : isSpeaking ? 'bg-orange-400' : 'bg-cyan-400'} ${(isListening || isSpeaking) ? 'animate-pulse' : ''}`}></span>
              ARIS Voice Assistant
            </h3>
            <p className="text-blue-200/70 text-xs mt-1">
              {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Click mic to ask questions'}
            </p>
          </div>
          
          <button
            onClick={toggleListening}
            className={`p-4 rounded-xl transition-all shadow-lg ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                : 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
            }`}
            title={isListening ? 'Stop listening (click to stop)' : 'Start voice input (click to speak)'}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-4 rounded-xl bg-orange-500 hover:bg-orange-600 transition-all animate-pulse shadow-lg"
              title="Stop speaking"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
        
        <div className="mb-3 p-2 bg-blue-950/50 rounded-lg border border-blue-400/20">
          <p className="text-blue-300/80 text-xs font-medium">💬 How it works:</p>
          <ul className="text-blue-200/60 text-xs mt-1 space-y-1 list-disc list-inside">
            <li>Click microphone to start</li>
            <li>Ask your question aloud</li>
            <li>AI will respond with voice + text</li>
          </ul>
        </div>

        {transcript && (
          <div className="mb-3 p-3 bg-blue-950/70 rounded-lg border-l-4 border-blue-400 shadow-inner">
            <p className="text-blue-300 text-xs font-bold mb-1.5 flex items-center gap-1">
              <span>🗣️</span> You asked:
            </p>
            <p className="text-white text-sm leading-relaxed">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="p-3 bg-gradient-to-br from-indigo-950/70 to-purple-950/70 rounded-lg border-l-4 border-cyan-400 shadow-inner">
            <p className="text-cyan-300 text-xs font-bold mb-1.5 flex items-center gap-1">
              <span>🤖</span> AI Response:
            </p>
            <p className="text-white text-sm leading-relaxed">{response}</p>
          </div>
        )}

        {!transcript && !response && (
          <div className="p-3 bg-blue-950/30 rounded-lg border border-dashed border-blue-400/30 text-center">
            <p className="text-blue-300/60 text-xs italic">
              Ready to answer your questions about the process...
            </p>
          </div>
        )}
      </div>
    );

  if (isXR) {
    return (
      <VoiceAssistantVR
        isListening={isListening}
        isSpeaking={isSpeaking}
        transcript={transcript}
        response={response}
        onStartListening={startListening}
        onStopListening={stopListening}
        onToggleListening={toggleListening}
        onStopSpeaking={stopSpeaking}
      />
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-[100]" style={{ pointerEvents: 'auto' }}>
      {panelContent}
    </div>
  );
}
