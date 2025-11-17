import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const MicrophoneIcon: React.FC<{ isRecording: boolean }> = ({ isRecording }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-colors ${isRecording ? 'text-red-500' : ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);

const PaperclipIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
    </svg>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);

interface ChatInputProps {
  onSendMessage: (message: string, image?: { base64: string; mimeType: string }) => void;
  isLoading: boolean;
  onCameraClick: () => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onerror: (event: any) => void;
    onresult: (event: any) => void;
    start: () => void;
    stop: () => void;
  }
  var SpeechRecognition: {
    new(): SpeechRecognition;
  };
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onCameraClick, imagePreview, setImagePreview }) => {
  const [input, setInput] = useState('');
  const { t, language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastFinalTranscript = useRef('');
  const isStoppingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedImage, setAttachedImage] = useState<{ base64: string; mimeType: string } | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    const langMap: { [key: string]: string } = {
        'en': 'en-US', 'en-GB': 'en-GB', 'en-IN': 'en-IN', 'es': 'es-ES', 'fr': 'fr-FR',
        'hi': 'hi-IN', 'bho': 'bho-IN', 'en-HI': 'en-IN', 'ml': 'ml-IN', 'ta': 'ta-IN',
    };
    recognition.lang = langMap[language] || 'en-US';

    recognition.onstart = () => {
      isStoppingRef.current = false;
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (!isStoppingRef.current) {
        try {
          setTimeout(() => recognition.start(), 100);
        } catch (e) {
          console.error("Error restarting speech recognition:", e);
        }
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        isStoppingRef.current = true;
      }
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let currentFinalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentFinalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      lastFinalTranscript.current += currentFinalTranscript;
      setInput(lastFinalTranscript.current + interimTranscript);
    };

    return () => {
      isStoppingRef.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
      }
    };
  }, [language]);

  const handleToggleRecording = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      isStoppingRef.current = true;
      recognition.stop();
    } else {
      lastFinalTranscript.current = '';
      setInput('');
      recognition.start();
    }
  }, [isRecording]);

  const resetInputState = () => {
    setInput('');
    setImagePreview(null);
    setAttachedImage(null);
    lastFinalTranscript.current = '';
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      isStoppingRef.current = true;
      recognitionRef.current?.stop();
    }
    if ((input.trim() || attachedImage) && !isLoading) {
      onSendMessage(input, attachedImage || undefined);
      resetInputState();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setImagePreview(reader.result as string);
            setAttachedImage({ base64: base64String, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    }
  };
  
  const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="p-2 bg-light-bg/50 dark:bg-dark-bg/50 backdrop-blur-md border-t border-black/10 dark:border-white/10">
      {imagePreview && (
          <div className="relative p-2">
              <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg" />
              <button
                  onClick={() => {
                      setImagePreview(null);
                      setAttachedImage(null);
                  }}
                  className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  aria-label="Remove image"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
          </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2 p-2 bg-light-bg-secondary/70 dark:bg-dark-bg-secondary/70 rounded-2xl">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
        />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-3 rounded-full text-secondary-text-light dark:text-secondary-text-dark hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50"><PaperclipIcon /></button>
        <button type="button" onClick={onCameraClick} disabled={isLoading} className="p-3 rounded-full text-secondary-text-light dark:text-secondary-text-dark hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50"><CameraIcon /></button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={isRecording ? "Listening..." : t('chatPlaceholder')}
          rows={1}
          className="flex-1 max-h-32 p-3 bg-transparent focus:outline-none resize-none transition-shadow duration-200 disabled:opacity-50 text-primary-text-light dark:text-primary-text-dark placeholder-secondary-text-light dark:placeholder-secondary-text-dark"
          disabled={isLoading}
          style={{ height: 'auto' }}
        />
        {hasSpeechRecognition && (
          <button
            type="button"
            onClick={handleToggleRecording}
            disabled={isLoading}
            className={`p-3 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 text-secondary-text-light dark:text-secondary-text-dark ${isRecording ? 'animate-pulse' : ''}`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <MicrophoneIcon isRecording={isRecording} />
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !attachedImage)}
          className="bg-accent text-white rounded-full p-3 hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-accent/50 dark:disabled:bg-accent/40 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;