import { useState, useEffect, useRef } from 'react';
import { useBPMN } from '../lib/stores/useBPMN';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import type { BPMNElement } from '../lib/bpmnParser';

interface VoiceAssistantProps {
  isXR?: boolean;
}

export function VoiceAssistant({ isXR = false }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);
  const { process } = useBPMN();
  const elements = process?.elements || [];

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          handleVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = async (text: string) => {
    console.log('Processing voice command:', text);
    
    // Build process context
    const processContext = `
Process: ${process?.name || 'Unnamed Process'}
Elements: ${elements.map((el: BPMNElement) => `${el.type}: ${el.name}${el.description ? ` - ${el.description}` : ''}`).join(', ')}
Total Elements: ${elements.length}
    `.trim();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processContext,
          question: text
        })
      });

      const data = await res.json();
      
      if (data.answer) {
        setResponse(data.answer);
        speak(data.answer);
      } else if (data.error) {
        setResponse(`Error: ${data.error}`);
        speak(`Sorry, I encountered an error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending voice command:', error);
      setResponse('Failed to get response from AI');
      speak('Sorry, I could not process your request.');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className={`${isXR ? 'hidden' : 'fixed bottom-6 right-6 z-50'}`}>
      <div className="bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 shadow-2xl max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ARIS AI Assistant
            </h3>
            <p className="text-blue-200/60 text-xs mt-1">Ask me about the process</p>
          </div>
          
          <button
            onClick={toggleListening}
            className={`p-3 rounded-lg transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-3 rounded-lg bg-orange-500 hover:bg-orange-600 transition-all animate-pulse"
              title="Stop speaking"
            >
              <Volume2 className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {transcript && (
          <div className="mb-2 p-2 bg-blue-950/50 rounded-lg border border-blue-500/20">
            <p className="text-blue-200 text-xs font-medium mb-1">You asked:</p>
            <p className="text-white text-sm">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="p-2 bg-indigo-950/50 rounded-lg border border-indigo-500/20">
            <p className="text-indigo-200 text-xs font-medium mb-1">Response:</p>
            <p className="text-white text-sm">{response}</p>
          </div>
        )}

        {!transcript && !response && (
          <p className="text-blue-300/50 text-xs italic">
            Click the microphone and ask a question...
          </p>
        )}
      </div>
    </div>
  );
}
