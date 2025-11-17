import React, { useState } from 'react';
import { Mood, MoodEntry, User } from '../types';
import { MOODS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface MoodCardProps {
  mood: Mood;
  onSelect: (mood: Mood) => void;
}

const MoodCard: React.FC<MoodCardProps> = ({ mood, onSelect }) => {
  const { t } = useLanguage();
  return (
    <button
      onClick={() => onSelect(mood)}
      className="group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-full aspect-square bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-white/50"
      style={{ '--glow-color': mood.color } as React.CSSProperties}
      aria-label={`Select mood: ${t(mood.name)}`}
    >
      <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl" style={{ color: mood.color }}></div>
      <span className="text-5xl sm:text-7xl transition-transform duration-300 group-hover:scale-110">{mood.emoji}</span>
      <span className="mt-2 text-sm font-bold text-primary-text-light dark:text-primary-text-dark">{t(mood.name)}</span>
    </button>
  );
};

interface MoodTrackerPageProps {
  currentUser: User;
  moodHistory: MoodEntry[];
  onSaveMood: (mood: Mood) => void;
  onNavigateToHistory: () => void;
}

const MoodTrackerPage: React.FC<MoodTrackerPageProps> = ({
  currentUser,
  moodHistory,
  onSaveMood,
  onNavigateToHistory,
}) => {
  const { t } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const handleSelectMood = (mood: Mood) => {
    setSelectedMood(mood);
    onSaveMood(mood);
    setTimeout(() => setSelectedMood(null), 2500); 
  };

  const lastMoodEntry = moodHistory.length > 0 ? moodHistory[0] : null;

  const greeting = `${t('howAreYouFeeling')}, ${currentUser.name}?`;

  return (
    <div className="flex flex-col items-center w-full min-h-full space-y-8 sm:space-y-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-gradient-start to-gradient-end dark:from-sky-300 dark:to-purple-400">
        {greeting}
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-2xl">
        {MOODS.slice(0, 3).map((mood) => (
          <MoodCard key={mood.name} mood={mood} onSelect={handleSelectMood} />
        ))}
        <div className="hidden sm:block"></div>
        {MOODS.slice(3).map((mood) => (
          <MoodCard key={mood.name} mood={mood} onSelect={handleSelectMood} />
        ))}
      </div>
      
      {selectedMood && (
        <div key={selectedMood.name} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade-in">
          <div className="text-center animate-out fade-out slide-out-to-top duration-1000" style={{animationDelay: '1.5s'}}>
            <p className="text-9xl animate-in zoom-in-150 duration-500">{selectedMood.emoji}</p>
            <p className="mt-4 text-xl font-bold bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full animate-in fade-in-0 slide-in-from-bottom-5 duration-500" style={{animationDelay: '0.2s'}}>{t('noted')}</p>
          </div>
        </div>
      )}

      {moodHistory.length > 0 && (
        <div className="w-full max-w-2xl p-6 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg">
            <h3 className="text-lg font-bold text-primary-text-light dark:text-primary-text-dark mb-2">{t('yourWeekAtGlance')}</h3>
            <div className="flex items-center justify-between mt-4">
                 <p className="text-secondary-text-light dark:text-secondary-text-dark">Your last entry was <span className="font-bold" style={{color: lastMoodEntry?.moodColor}}>{lastMoodEntry ? t(lastMoodEntry.moodName) : ''}</span>.</p>
                 <button onClick={onNavigateToHistory} className="font-semibold text-accent dark:text-accent-glow hover:underline">
                    {t('viewFullHistory')}
                 </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MoodTrackerPage;