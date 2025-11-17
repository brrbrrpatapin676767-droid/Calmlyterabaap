import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { Message } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import CameraModal from './CameraModal';

interface ChatPageProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string, image?: { base64: string; mimeType: string }) => void;
  onMenuClick: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ messages, isLoading, onSendMessage, onMenuClick }) => {
  const { language } = useLanguage();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // TTS voices
  useEffect(() => {
    const updateVoices = () => setVoices(speechSynthesis.getVoices());
    speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();
    return () => {
      speechSynthesis.cancel();
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handlePlayAudio = useCallback((id: string, text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    const selectedVoice = voices.find(v => v.lang === language) || voices.find(v => v.lang.startsWith(language.split('-')[0])) || voices.find(v => v.lang.startsWith('en'));
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = () => setCurrentlyPlayingId(null);
    utterance.onerror = () => setCurrentlyPlayingId(null);
    setCurrentlyPlayingId(id);
    speechSynthesis.speak(utterance);
  }, [voices, language]);

  const handlePauseAudio = useCallback(() => {
    speechSynthesis.cancel();
    setCurrentlyPlayingId(null);
  }, []);
  
  const handleSendMessageWithImage = (message: string, image?: {base64: string, mimeType: string}) => {
      onSendMessage(message, image);
      // Reset image preview after sending
      setImagePreview(null);
  }

  const handlePhotoTaken = (dataUrl: string) => {
      // dataUrl includes the mime type prefix, e.g., "data:image/jpeg;base64,"
      setImagePreview(dataUrl);
      setIsCameraOpen(false);
  };
  
  // When a new image is selected via preview, prepare it for sending
  const imageToSend = useMemo(() => {
    if (!imagePreview) return undefined;
    const parts = imagePreview.split(',');
    if (parts.length !== 2) return undefined;
    
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const base64 = parts[1];
    
    return { base64, mimeType };
  }, [imagePreview]);


  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    return messages.filter(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [messages, searchQuery]);

  return (
    <div className="flex flex-col flex-1 h-full bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 backdrop-blur-lg md:rounded-3xl md:m-4 md:shadow-2xl overflow-hidden border-black/5 dark:border-white/10 md:border">
      <ChatWindow
        messages={filteredMessages}
        isLoading={isLoading}
        currentlyPlayingId={currentlyPlayingId}
        onPlayAudio={handlePlayAudio}
        onPauseAudio={handlePauseAudio}
        searchQuery={searchQuery}
        onMenuClick={onMenuClick}
      />
      <ChatInput 
        onSendMessage={(messageText) => handleSendMessageWithImage(messageText, imageToSend)} 
        isLoading={isLoading} 
        onCameraClick={() => setIsCameraOpen(true)}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
      {isCameraOpen && <CameraModal onPhotoTaken={handlePhotoTaken} onClose={() => setIsCameraOpen(false)} />}
    </div>
  );
};

export default ChatPage;
