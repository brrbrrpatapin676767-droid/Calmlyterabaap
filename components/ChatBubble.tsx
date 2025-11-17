import React from 'react';
import { Message, Sender } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-accent/30 text-primary-text-light dark:text-primary-text-dark rounded px-0.5">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </span>
    );
};

// Simple Markdown-like renderer
const FormattedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    const lines = text.split('\n');
    return (
        <>
            {lines.map((line, lineIndex) => {
                if (line.startsWith('* ')) {
                    const content = line.substring(2);
                    return (
                        <div key={lineIndex} className="flex items-start">
                            <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent"></span>
                            <p className="flex-1"><HighlightedText text={content} highlight={highlight} /></p>
                        </div>
                    );
                }

                // Regex to find **bold** and *italic* text
                const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);

                return (
                    <p key={lineIndex} className="my-1">
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIndex}><HighlightedText text={part.slice(2, -2)} highlight={highlight} /></strong>;
                            }
                            if (part.startsWith('*') && part.endsWith('*')) {
                                return <em key={partIndex}><HighlightedText text={part.slice(1, -1)} highlight={highlight} /></em>;
                            }
                            return <HighlightedText key={partIndex} text={part} highlight={highlight} />;
                        })}
                    </p>
                );
            })}
        </>
    );
};

const SpeakerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);

const PauseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />
    </svg>
);

interface ChatBubbleProps {
  message: Message;
  currentlyPlayingId: string | null;
  onPlayAudio: (id: string, text: string) => void;
  onPauseAudio: () => void;
  searchQuery?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, currentlyPlayingId, onPlayAudio, onPauseAudio, searchQuery }) => {
  const { t } = useLanguage();
  const isUser = message.sender === Sender.User;
  const isPlaying = currentlyPlayingId === message.id;

  const bubbleClasses = isUser
    ? 'bg-gradient-to-br from-gradient-start to-gradient-end text-white self-end'
    : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-primary-text-light dark:text-primary-text-dark self-start shadow-md';
  
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  const handleTogglePlay = () => {
    if (isPlaying) {
      onPauseAudio();
    } else {
      onPlayAudio(message.id, message.text);
    }
  };

  return (
    <div className={`flex w-full my-2 items-end gap-2 ${containerClasses}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-2xl px-1 py-1 rounded-2xl ${bubbleClasses}`}
      >
        {message.image && (
            <div className="p-2">
                <img 
                    src={`data:${message.image.mimeType};base64,${message.image.base64}`} 
                    alt="User upload" 
                    className="rounded-xl w-full max-h-64 object-cover"
                />
            </div>
        )}
        <div className={`whitespace-pre-wrap p-3 ${message.image ? 'pt-1' : 'pt-2'}`}>
          <FormattedText text={message.text} highlight={searchQuery || ''} />
        </div>
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-3 border-t border-black/10 dark:border-white/10 px-3 pb-2">
            <h4 className="text-xs font-bold uppercase text-secondary-text-light dark:text-secondary-text-dark mb-1">{t('sources')}</h4>
            <ul className="space-y-1">
              {message.sources.map((source, index) => (
                <li key={index} className="text-sm">
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-accent dark:text-accent-glow hover:underline"
                  >
                    <span className="flex-shrink-0 opacity-80">[{index + 1}]</span>
                    <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {!isUser && (message.text.trim().length > 0) && (
        <button
          onClick={handleTogglePlay}
          aria-label={isPlaying ? t('pauseReading') : t('readAloud')}
          className="p-2 rounded-full text-secondary-text-light dark:text-secondary-text-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          {isPlaying ? <PauseIcon /> : <SpeakerIcon />}
        </button>
      )}
    </div>
  );
};

export default ChatBubble;