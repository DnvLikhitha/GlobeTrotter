// Voice Commands Integration using Web Speech API

export class VoiceCommandHandler {
  constructor(onCommand) {
    this.recognition = null;
    this.isListening = false;
    this.onCommand = onCommand;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  setupRecognition() {
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      this.processCommand(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  processCommand(transcript) {
    console.log('Voice command:', transcript);
    
    const commands = {
      // Navigation commands
      'go to dashboard': { action: 'navigate', target: '/dashboard' },
      'show my trips': { action: 'navigate', target: '/trips' },
      'create new trip': { action: 'navigate', target: '/trips/new' },
      'go to profile': { action: 'navigate', target: '/profile' },
      'show calendar': { action: 'navigate', target: '/calendar' },
      'search cities': { action: 'navigate', target: '/cities' },
      
      // Action commands
      'add trip': { action: 'create', type: 'trip' },
      'search for': { action: 'search', query: transcript.replace('search for', '').trim() },
      'show weather': { action: 'toggle', feature: 'weather' },
      'dark mode': { action: 'toggle', feature: 'theme' },
      'light mode': { action: 'toggle', feature: 'theme' },
      
      // Trip management
      'delete trip': { action: 'delete', type: 'trip' },
      'edit trip': { action: 'edit', type: 'trip' },
      'share trip': { action: 'share', type: 'trip' },
      
      // Filters and sorts
      'sort by date': { action: 'sort', field: 'date' },
      'sort by budget': { action: 'sort', field: 'budget' },
      'filter upcoming': { action: 'filter', value: 'upcoming' },
      'filter past': { action: 'filter', value: 'past' },
      'show all': { action: 'filter', value: 'all' }
    };

    // Find matching command
    let matchedCommand = null;
    for (const [key, value] of Object.entries(commands)) {
      if (transcript.includes(key)) {
        matchedCommand = value;
        break;
      }
    }

    if (matchedCommand) {
      this.onCommand(matchedCommand);
      this.speak(`Okay, ${transcript}`);
    } else {
      this.speak("I didn't understand that command. Try saying 'show my trips' or 'create new trip'");
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
      return true;
    }
    return false;
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  isSupported() {
    return ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }
}

// React Hook for Voice Commands
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceHandler, setVoiceHandler] = useState(null);
  const [lastCommand, setLastCommand] = useState(null);
  const navigate = useNavigate();

  const handleCommand = useCallback((command) => {
    setLastCommand(command);
    
    switch (command.action) {
      case 'navigate':
        navigate(command.target);
        break;
      case 'search':
        // Trigger search with command.query
        break;
      case 'toggle':
        // Toggle feature (theme, weather, etc.)
        break;
      case 'filter':
      case 'sort':
        // Update filters/sorts
        break;
      default:
        console.log('Unhandled command:', command);
    }
  }, [navigate]);

  useEffect(() => {
    const handler = new VoiceCommandHandler(handleCommand);
    setVoiceHandler(handler);
    
    return () => {
      if (handler) {
        handler.stop();
      }
    };
  }, [handleCommand]);

  const startListening = () => {
    if (voiceHandler && voiceHandler.start()) {
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (voiceHandler) {
      voiceHandler.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    isSupported: voiceHandler?.isSupported() || false,
    startListening,
    stopListening,
    toggleListening,
    lastCommand
  };
};
