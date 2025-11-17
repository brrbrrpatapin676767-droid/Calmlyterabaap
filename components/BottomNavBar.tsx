import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { View } from '../types';

const MoodsIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm4.5 0c0 .414-.168.75-.375.75s-.375-.414-.375-.75.168-.75.375-.75.375.336.375.75Z" />
  </svg>
);

const ChatIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.092c-.381-1.24-.623-2.544-.623-3.875a9.75 9.75 0 0 1 5.006-8.414 4.482 4.482 0 0 0 2.433-3.69C19.27 4.212 21 7.845 21 12Z" />
  </svg>
);


const ActivitiesIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-6ZM16.5 6a.75.75 0 0 0-1.5 0v12a.75.75 0 0 0 1.5 0v-12ZM10.5 3a.75.75 0 0 0-1.5 0v18a.75.75 0 0 0 1.5 0v-18Z" />
    </svg>
);

const SOSIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


interface BottomNavBarProps {
  activeView: View;
  setView: (view: View) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setView }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'chat', label: t('chatNav'), icon: ChatIcon, views: ['chat'] },
    { id: 'tracker', label: t('moodsNav'), icon: MoodsIcon, views: ['tracker', 'history'] },
    { id: 'games', label: t('activitiesNav'), icon: ActivitiesIcon, views: ['games'] },
    { id: 'sos', label: t('sosNav'), icon: SOSIcon, views: ['sos'] },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm mx-auto z-50">
      <div className="flex justify-around items-center h-20 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/5 dark:border-white/10">
        {navItems.map((item) => {
          const isActive = item.views.includes(activeView);
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as 'tracker' | 'chat' | 'games' | 'sos')}
              className={`relative flex flex-col items-center justify-center w-24 h-20 rounded-2xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent/50 ${isActive ? 'text-accent dark:text-accent-glow' : 'text-secondary-text-light dark:text-secondary-text-dark hover:text-primary-text-light dark:hover:text-primary-text-dark'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon isActive={isActive} />
              <span className={`text-xs font-bold mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
              {isActive && <div className="absolute bottom-1.5 h-1 w-1 rounded-full bg-accent dark:bg-accent-glow animate-pulse"></div>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;