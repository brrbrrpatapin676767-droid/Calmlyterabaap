import React from 'react';
import { ChatSession, View } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeView: View;
  setView: (view: View) => void;
}

const NewChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);
const ChatBubbleIcon: React.FC<{isActive: boolean}> = ({isActive}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a5.565 5.565 0 0 1-1.082 2.185l-1.473 1.473a3.873 3.873 0 0 1-5.479 0l-1.473-1.473a5.565 5.565 0 0 1-1.082-2.185l-3.722-.537A2.25 2.25 0 0 1 2.25 15V9.574c0-.969.616-1.813 1.5-2.097" /></svg>
);
const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
);

// Icons for the new nav section
const MoodsIcon: React.FC<{isActive: boolean}> = ({isActive}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm4.5 0c0 .414-.168.75-.375.75s-.375-.414-.375-.75.168-.75.375-.75.375.336.375.75Z" /></svg> );
const ActivitiesIcon: React.FC<{isActive: boolean}> = ({isActive}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-6ZM16.5 6a.75.75 0 0 0-1.5 0v12a.75.75 0 0 0 1.5 0v-12ZM10.5 3a.75.75 0 0 0-1.5 0v18a.75.75 0 0 0 1.5 0v-18Z" /></svg> );
const SOSIcon: React.FC<{isActive: boolean}> = ({isActive}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg> );


const ChatSidebar: React.FC<ChatSidebarProps> = ({ sessions, activeSessionId, onSessionSelect, onNewChat, onDeleteSession, isOpen, setIsOpen, activeView, setView }) => {
    const { t } = useLanguage();

    const handleDelete = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this chat?")) {
            onDeleteSession(sessionId);
        }
    };

    const navItems = [
      { id: 'chat', label: t('chatNav'), icon: ChatBubbleIcon, views: ['chat'] },
      { id: 'tracker', label: t('moodsNav'), icon: MoodsIcon, views: ['tracker', 'history'] },
      { id: 'games', label: t('activitiesNav'), icon: ActivitiesIcon, views: ['games'] },
      { id: 'sos', label: t('sosNav'), icon: SOSIcon, views: ['sos'] },
    ];
    
    const sidebarContent = (
      <div className="flex flex-col h-full bg-light-sidebar dark:bg-dark-sidebar p-3">
        <button 
          onClick={onNewChat}
          className="flex items-center justify-between w-full p-3 rounded-lg text-left text-sm font-semibold border border-black/10 dark:border-white/10 text-primary-text-light dark:text-primary-text-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          New Chat
          <NewChatIcon />
        </button>

        <div className="mt-4 flex-1 overflow-y-auto">
          <p className="px-3 py-1 text-xs font-semibold text-secondary-text-light dark:text-secondary-text-dark uppercase tracking-wider">Chats</p>
          <ul className="space-y-1 mt-1">
            {sessions.map(session => (
              <li key={session.id}>
                <button
                  onClick={() => {
                      onSessionSelect(session.id);
                      setView('chat');
                      setIsOpen(false);
                  }}
                  className={`group flex items-center justify-between w-full p-3 rounded-lg text-left text-sm truncate transition-colors ${
                    activeSessionId === session.id && activeView === 'chat'
                      ? 'bg-accent/20 text-accent-dark dark:text-accent-glow font-semibold'
                      : 'text-secondary-text-light dark:text-secondary-text-dark hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <ChatBubbleIcon isActive={activeSessionId === session.id && activeView === 'chat'} />
                    <span className="truncate">{session.title}</span>
                  </span>
                  <button onClick={(e) => handleDelete(e, session.id)} className="opacity-0 group-hover:opacity-100 text-secondary-text-light dark:text-secondary-text-dark hover:text-red-500 transition-opacity p-1 z-10">
                    <TrashIcon />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block pt-2 border-t border-black/10 dark:border-white/10">
           <p className="px-3 py-1 text-xs font-semibold text-secondary-text-light dark:text-secondary-text-dark uppercase tracking-wider">Tools</p>
           <ul className="space-y-1 mt-1">
              {navItems.map(item => {
                  const isActive = item.views.includes(activeView);
                  return (
                    <li key={item.id}>
                        <button
                            onClick={() => setView(item.id as View)}
                            className={`group flex items-center gap-3 w-full p-3 rounded-lg text-left text-sm font-semibold transition-colors ${
                                isActive 
                                ? 'bg-accent/20 text-accent-dark dark:text-accent-glow' 
                                : 'text-secondary-text-light dark:text-secondary-text-dark hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                        >
                            <item.icon isActive={isActive} />
                            {item.label}
                        </button>
                    </li>
                  )
              })}
           </ul>
        </div>
      </div>
    );
    
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in"></div>}

            {/* Mobile Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-72 z-40 transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent}
            </aside>
            
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
                {sidebarContent}
            </aside>
        </>
    );
};

export default ChatSidebar;
