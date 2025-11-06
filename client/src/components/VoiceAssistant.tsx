import { useState, useEffect, useRef, useCallback } from 'react';
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

function VoiceAssistantVR({ 
  isListening, 
  isSpeaking,
  transcript,
  response,
  onToggleListening,
  onStopSpeaking
}: { 
  isListening: boolean; 
  isSpeaking: boolean;
  transcript: string;
  response: string;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const xrInput = useXRInput();
  
  useEffect(() => {
    console.log('[VoiceAssistantVR] Registering button handlers');
    const leftId = xrInput.registerButtonPress('leftTrigger', () => {
      console.log('Left trigger pressed - toggling voice assistant');
      onToggleListening();
    });
    
    const rightId = xrInput.registerButtonPress('rightTrigger', () => {
      console.log('Right trigger pressed - toggling voice assistant');
      onToggleListening();
    });
    
    return () => {
      console.log('[VoiceAssistantVR] Unregistering button handlers');
      xrInput.unregisterButtonPress(leftId);
      xrInput.unregisterButtonPress(rightId);
    };
  }, []);
  
  // Animate the sphere in VR
  useFrame((state) => {
    if (sphereRef.current) {
      const time = state.clock.getElapsedTime();
      sphereRef.current.position.y = 1.5 + Math.sin(time * 2) * 0.1;
      sphereRef.current.rotation.y = time * 0.5;
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
          opacity={0.4}
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
        {isListening ? 'Speak your question...' : isSpeaking ? 'AI is responding...' : 'Press trigger to ask'}
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
}

export function VoiceAssistant({ isXR = false }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const recognitionStateRef = useRef<'idle' | 'starting' | 'active' | 'stopping'>('idle');
  const instanceVersionRef = useRef(0);
  const { process } = useBPMN();
  const elements = process?.elements || [];

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const createRecognitionInstance = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('[VoiceAssistant] SpeechRecognition not supported');
      return null;
    }

    instanceVersionRef.current++;
    const version = instanceVersionRef.current;
    console.log(`[VoiceAssistant] Creating recognition instance v${version}`);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log(`[VoiceAssistant v${version}] onstart fired - state:`, recognitionStateRef.current);
      recognitionStateRef.current = 'active';
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      console.log(`[VoiceAssistant v${version}] onresult:`, { transcript, isFinal: event.results[current].isFinal });
      setTranscript(transcript);
      
      if (event.results[current].isFinal) {
        console.log(`[VoiceAssistant v${version}] Final transcript, processing command`);
        handleVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error(`[VoiceAssistant v${version}] onerror:`, event.error);
      recognitionStateRef.current = 'idle';
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log(`[VoiceAssistant v${version}] onend fired - state:`, recognitionStateRef.current);
      recognitionStateRef.current = 'idle';
      setIsListening(false);
    };

    return recognition;
  }, []);

  useEffect(() => {
    console.log('[VoiceAssistant] Initializing recognition system');
    recognitionRef.current = createRecognitionInstance();

    return () => {
      console.log('[VoiceAssistant] Cleanup - destroying recognition');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.warn('[VoiceAssistant] Cleanup abort failed:', e);
        }
      }
    };
  }, [createRecognitionInstance]);

  const handleVoiceCommand = async (text: string) => {
    console.log('[VoiceAssistant] Processing voice command:', text);
    
    // Build process context
    const processContext = `
Process: ${process?.name || 'Unnamed Process'}
Elements: ${elements.map((el: BPMNElement) => `${el.type}: ${el.name}${el.description ? ` - ${el.description}` : ''}`).join(', ')}
Total Elements: ${elements.length}
    `.trim();

    console.log('[VoiceAssistant] Sending to API:', { processContext, question: text });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processContext,
          question: text
        })
      });

      console.log('[VoiceAssistant] API response status:', res.status);
      const data = await res.json();
      console.log('[VoiceAssistant] API response data:', data);
      
      if (data.answer) {
        console.log('[VoiceAssistant] AI Answer:', data.answer);
        setResponse(data.answer);
        speak(data.answer);
      } else if (data.error) {
        console.error('[VoiceAssistant] API error:', data.error);
        setResponse(`Error: ${data.error}`);
        speak(`Sorry, I encountered an error: ${data.error}`);
      }
    } catch (error) {
      console.error('[VoiceAssistant] Error sending voice command:', error);
      setResponse('Failed to get response from AI');
      speak('Sorry, I could not process your request.');
    }
  };

  const speak = (text: string) => {
    console.log('[VoiceAssistant] Speaking:', text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        console.log('[VoiceAssistant] Speech synthesis STARTED');
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        console.log('[VoiceAssistant] Speech synthesis ENDED');
        setIsSpeaking(false);
      };
      utterance.onerror = (e) => {
        console.error('[VoiceAssistant] Speech synthesis ERROR:', e);
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const hardResetRecognition = useCallback(() => {
    console.log('[VoiceAssistant] HARD RESET - destroying and recreating instance');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        console.log('[VoiceAssistant] Aborted old instance');
      } catch (e) {
        console.warn('[VoiceAssistant] Abort failed during reset:', e);
      }
    }
    
    recognitionRef.current = createRecognitionInstance();
    recognitionStateRef.current = 'idle';
    setIsListening(false);
    console.log('[VoiceAssistant] Hard reset complete, new instance ready');
  }, [createRecognitionInstance]);

  const toggleListening = useCallback(() => {
    const currentState = recognitionStateRef.current;
    console.log('[VoiceAssistant] toggleListening called', { 
      stateRef: currentState,
      isListening: isListeningRef.current,
      hasRecognition: !!recognitionRef.current,
      version: instanceVersionRef.current
    });
    
    if (!recognitionRef.current) {
      console.error('[VoiceAssistant] No recognition instance, creating one');
      recognitionRef.current = createRecognitionInstance();
      if (!recognitionRef.current) {
        alert('Voice recognition is not supported in your browser');
        return;
      }
    }

    if (currentState === 'active' || currentState === 'starting') {
      console.log('[VoiceAssistant] Stopping recognition...');
      recognitionStateRef.current = 'stopping';
      
      try {
        recognitionRef.current.stop();
        console.log('[VoiceAssistant] stop() called');
        
        setTimeout(() => {
          if (recognitionStateRef.current !== 'idle') {
            console.warn('[VoiceAssistant] onend never fired after stop(), using abort()');
            try {
              recognitionRef.current?.abort();
              console.log('[VoiceAssistant] abort() called');
            } catch (e) {
              console.error('[VoiceAssistant] abort() failed:', e);
            }
            
            setTimeout(() => {
              if (recognitionStateRef.current !== 'idle') {
                console.error('[VoiceAssistant] Still not idle after abort(), forcing hard reset');
                hardResetRecognition();
              }
            }, 300);
          }
        }, 500);
      } catch (error) {
        console.error('[VoiceAssistant] stop() failed:', error);
        hardResetRecognition();
      }
    } else if (currentState === 'idle') {
      console.log('[VoiceAssistant] Starting recognition...');
      recognitionStateRef.current = 'starting';
      
      try {
        setTranscript('');
        setResponse('');
        recognitionRef.current.start();
        console.log('[VoiceAssistant] start() called');
      } catch (error: any) {
        console.error('[VoiceAssistant] start() failed:', error);
        
        if (error.message?.includes('already started')) {
          console.error('[VoiceAssistant] Instance stuck in started state, forcing hard reset');
          hardResetRecognition();
          
          setTimeout(() => {
            console.log('[VoiceAssistant] Retrying start after hard reset');
            try {
              setTranscript('');
              setResponse('');
              recognitionRef.current?.start();
            } catch (retryError) {
              console.error('[VoiceAssistant] Retry start failed:', retryError);
            }
          }, 100);
        } else {
          recognitionStateRef.current = 'idle';
        }
      }
    } else {
      console.warn('[VoiceAssistant] In transition state:', currentState, '- ignoring toggle');
    }
  }, [createRecognitionInstance, hardResetRecognition]);

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
