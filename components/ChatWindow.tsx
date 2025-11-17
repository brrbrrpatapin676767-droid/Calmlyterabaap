import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatBubble from './ChatBubble';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  currentlyPlayingId: string | null;
  onPlayAudio: (id: string, text: string) => void;
  onPauseAudio: () => void;
  searchQuery?: string;
  onMenuClick: () => void;
}

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, currentlyPlayingId, onPlayAudio, onPauseAudio, searchQuery, onMenuClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
       <div className="p-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between transition-all duration-300 md:hidden">
            <button 
                onClick={onMenuClick}
                className="p-2 -ml-2 rounded-full text-secondary-text-light dark:text-secondary-text-dark hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Open chat history"
            >
                <MenuIcon />
            </button>
            <h2 className="text-lg font-bold text-primary-text-light dark:text-primary-text-dark">
              {t('chatNav')}
            </h2>
            <div className="w-8"></div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex flex-col space-y-2">
          {messages.length === 0 && searchQuery && !isLoading && (
              <div className="text-center text-secondary-text-light dark:text-secondary-text-dark py-10 animate-fade-in">
                  <p className="font-semibold">No results found</p>
                  <p className="text-sm">Try searching for something else.</p>
              </div>
          )}
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              currentlyPlayingId={currentlyPlayingId}
              onPlayAudio={onPlayAudio}
              onPauseAudio={onPauseAudio}
              searchQuery={searchQuery}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary text-primary-text-light dark:text-primary-text-dark self-start shadow-md px-4 py-3 rounded-2xl">
                  <LoadingSpinner />
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;