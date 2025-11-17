import React, { useState, useEffect, useCallback } from 'react';
import { Mood, MoodEntry, User, View, Message, Sender, ChatSession } from './types';
import { getMoodHistory, saveMoodEntry } from './services/moodService';
import { getCurrentUser } from './services/authService';
import { getChatSessions, saveMessages, getMessages, createNewSession, updateSessionTitle, deleteSession } from './services/chatService';
import { generateChatTitle, sendMessage } from './services/geminiService';
import { useLanguage } from './contexts/LanguageContext';

import MoodTrackerPage from './components/MoodTrackerPage';
import MoodHistoryPage from './components/MoodHistoryPage';
import IntroductionPage from './components/IntroductionPage';
import ChatPage from './components/ChatPage';
import BottomNavBar from './components/BottomNavBar';
import SettingsMenu from './components/SettingsMenu';
import GamesPage from './components/GamesPage';
import SOSPage from './components/SOSPage';
import SplashScreen from './components/SplashScreen';
import ChatSidebar from './components/ChatSidebar';

const App: React.FC = () => {
  const { t } = useLanguage();
  const currentUser = getCurrentUser();

  // Global App State
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(localStorage.getItem('calmly_seen_intro') === 'true');
  const [view, setView] = useState<View>('chat');
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Mood State
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  // Chat State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);


  // --- App Initialization & Theme ---
  useEffect(() => {
    const splashTimer = setTimeout(() => setIsLoadingApp(false), 2500);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('calmly_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    setMoodHistory(getMoodHistory());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('calmly_theme', theme);
  }, [theme]);
  
  // --- Chat Session Management ---
  useEffect(() => {
    const loadedSessions = getChatSessions();
    setSessions(loadedSessions);
    if (loadedSessions.length > 0) {
      setActiveSessionId(loadedSessions[0].id);
    } else {
      handleNewChat();
    }
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      const history = getMessages(activeSessionId);
      if (history.length > 0) {
        setMessages(history);
      } else {
        setMessages([{ id: crypto.randomUUID(), text: t('initialGreeting'), sender: Sender.AI }]);
      }
    }
  }, [activeSessionId, t]);
  
  useEffect(() => {
      if (activeSessionId && messages.length > 0) {
          if (messages.length === 1 && messages[0].text === t('initialGreeting')) return;
          saveMessages(activeSessionId, messages);
      }
  }, [messages, activeSessionId, t]);

  const handleThemeToggle = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const handleIntroComplete = () => {
    localStorage.setItem('calmly_seen_intro', 'true');
    setHasSeenIntro(true);
  }

  const handleSaveMood = useCallback((mood: Mood) => {
    saveMoodEntry(mood);
    setMoodHistory(getMoodHistory());
  }, []);

  const handleNewChat = () => {
    const newSession = createNewSession();
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setMessages([{ id: crypto.randomUUID(), text: t('initialGreeting'), sender: Sender.AI }]);
    setIsSidebarOpen(false);
  };
  
  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsSidebarOpen(false);
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    if (activeSessionId === sessionId) {
        if (updatedSessions.length > 0) {
            setActiveSessionId(updatedSessions[0].id);
        } else {
            handleNewChat();
        }
    }
  };

  const handleSendMessage = async (messageText: string, image?: { base64: string; mimeType: string }) => {
    if (!activeSessionId) return;
    if (!messageText.trim() && !image) return;

    const newUserMessage: Message = { id: crypto.randomUUID(), text: messageText, sender: Sender.User, image };
    const currentMessages = getMessages(activeSessionId);
    setMessages(prev => [...prev, newUserMessage]);
    setIsAiLoading(true);

    const isFirstMessage = currentMessages.length <= 1;

    try {
      const aiResponse = await sendMessage(activeSessionId, messageText, currentMessages, image);
      const newAiMessage: Message = { id: crypto.randomUUID(), text: aiResponse.text, sender: Sender.AI, sources: aiResponse.sources };
      setMessages(prev => [...prev, newAiMessage]);
      
      if (isFirstMessage) {
        const title = await generateChatTitle(messageText, aiResponse.text);
        updateSessionTitle(activeSessionId, title);
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, title } : s));
      }

    } catch (error) {
      const errorMessage: Message = { id: crypto.randomUUID(), text: t('apiError'), sender: Sender.AI };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };


  const renderContent = () => {
      const mainContentClasses = "container mx-auto max-w-4xl p-4 sm:p-6 md:p-8 pb-32 animate-fade-in w-full h-full";
      
      switch (view) {
        case 'chat':
          return (
            <ChatPage 
              messages={messages}
              isLoading={isAiLoading}
              onSendMessage={handleSendMessage}
              onMenuClick={() => setIsSidebarOpen(true)}
            />
          );
        case 'tracker':
          return (
            <main className={mainContentClasses}>
              <MoodTrackerPage
                currentUser={currentUser}
                moodHistory={moodHistory}
                onSaveMood={handleSaveMood}
                onNavigateToHistory={() => setView('history')}
              />
            </main>
          );
        case 'history':
          return (
            <main className={mainContentClasses}>
              <MoodHistoryPage
                moodHistory={moodHistory}
                onNavigateBack={() => setView('tracker')}
              />
            </main>
          );
        case 'games':
          return (
            <main className={mainContentClasses}>
              <GamesPage />
            </main>
          );
        case 'sos':
          return (
            <main className={mainContentClasses}>
              <SOSPage />
            </main>
          );
        default:
          return null;
      }
  };
  
  const MainApp = () => (
    <div className="min-h-screen w-full bg-light-bg dark:bg-dark-bg text-primary-text-light dark:text-primary-text-dark font-sans transition-colors duration-500">
      <div className="absolute inset-0 -z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-slate-950 dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,#00569E,transparent)]"></div>
      </div>
      <div className="relative z-10 md:flex h-screen w-screen overflow-hidden">
        <SettingsMenu theme={theme} onThemeToggle={handleThemeToggle} />
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeView={view}
          setView={setView}
        />
        <div className={`flex-1 flex flex-col h-full`}>
          {renderContent()}
        </div>
        <div className="md:hidden">
          <BottomNavBar activeView={view} setView={setView} />
        </div>
      </div>
    </div>
  );

  if (isLoadingApp) {
    return <SplashScreen />;
  }

  return hasSeenIntro ? <MainApp /> : <IntroductionPage onStart={handleIntroComplete} />;
};

export default App;
