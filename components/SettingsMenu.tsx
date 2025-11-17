import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../services/translationService';

const SunIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.92-.99 6.697-2.648Z" />
    </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.905c.008.379.137.752.43.992l1.003.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.6 6.6 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.905c-.008-.379-.137-.752-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.298-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


interface SettingsMenuProps {
  theme: string;
  onThemeToggle: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ theme, onThemeToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="fixed top-4 left-4 z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 backdrop-blur-sm text-primary-text-light dark:text-primary-text-dark hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent shadow-md transition-colors"
        aria-label="Open settings menu"
      >
        <SettingsIcon />
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-64 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 backdrop-blur-lg rounded-xl shadow-2xl border border-black/5 dark:border-white/10 p-4 animate-fade-in-down">
          <ul className="space-y-2">
            {/* Theme Toggle */}
            <li className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              <span className="font-semibold text-sm">{t('theme')}</span>
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-lg"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
            </li>
            
            {/* Language Selector */}
            <li className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              <label htmlFor="language-select" className="font-semibold text-sm">{t('language')}</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-primary-text-light dark:text-primary-text-dark border border-secondary-text-light/50 dark:border-white/20 rounded-md py-1.5 px-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="en" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">English</option>
                <option value="en-GB" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">British English</option>
                <option value="en-IN" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">Indian English</option>
                <option value="es" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">Español</option>
                <option value="fr" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">Français</option>
                <option value="hi" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">हिन्दी (Hindi)</option>
                <option value="bho" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">भोजपुरी (Bhojpuri)</option>
                <option value="en-HI" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">Hinglish</option>
                <option value="ml" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">മലയാളം (Malayalam)</option>
                <option value="ta" className="bg-light-bg text-primary-text-light dark:bg-dark-bg-secondary dark:text-primary-text-dark">தமிழ் (Tamil)</option>
              </select>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;