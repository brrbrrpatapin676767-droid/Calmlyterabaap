import React, { useMemo } from 'react';
import { MoodEntry, Mood } from '../types';
import { MOOD_MAP } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface MoodHistoryPageProps {
  moodHistory: MoodEntry[];
  onNavigateBack: () => void;
}

const MoodCalendar: React.FC<{ history: MoodEntry[] }> = ({ history }) => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const moodByDate = useMemo(() => {
        const map = new Map<string, { color: string; emoji: string }>();
        history.forEach(entry => {
            const date = new Date(entry.timestamp);
            if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
                const dateString = date.toISOString().split('T')[0];
                if (!map.has(dateString)) {
                    const mood = MOOD_MAP[entry.moodName];
                    map.set(dateString, { color: mood.color, emoji: mood.emoji });
                }
            }
        });
        return map;
    }, [history, today]);

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="grid grid-cols-7 gap-2 p-4 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md rounded-2xl">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center font-bold text-xs text-secondary-text-light dark:text-secondary-text-dark">{day}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
            {days.map(day => {
                const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const moodData = moodByDate.get(dateString);
                return (
                    <div key={day} className="relative aspect-square flex items-center justify-center text-sm rounded-lg"
                        style={{ backgroundColor: moodData ? `${moodData.color}40` : 'transparent' }}
                    >
                        {moodData && <div className="absolute inset-0.5 rounded-lg opacity-50" style={{ backgroundColor: moodData.color }}></div>}
                        <span className="relative z-10">{day}</span>
                    </div>
                );
            })}
        </div>
    );
};


const MoodHistoryPage: React.FC<MoodHistoryPageProps> = ({ moodHistory, onNavigateBack }) => {
  const { t } = useLanguage();
  
  const mostCommonMoodThisWeek = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentHistory = moodHistory.filter(entry => new Date(entry.timestamp) > sevenDaysAgo);
    
    if (recentHistory.length === 0) return null;
    
    const moodCounts = recentHistory.reduce((acc, entry) => {
      acc[entry.moodName] = (acc[entry.moodName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b) as Mood['name'];
  }, [moodHistory]);

  return (
    <div className="flex flex-col w-full min-h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gradient-start to-gradient-end dark:from-sky-300 dark:to-purple-400">
          {t('moodHistory')}
        </h1>
        <button
          onClick={onNavigateBack}
          className="px-5 py-3 font-semibold bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-full shadow-lg hover:bg-light-bg-secondary/60 dark:hover:bg-dark-bg-secondary/60 transition-colors duration-200"
        >
          &larr; {t('back')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg">
            <h3 className="text-lg font-bold text-primary-text-light dark:text-primary-text-dark mb-2">{t('thisWeeksVibe')}</h3>
            <p className="text-3xl font-semibold" style={{ color: mostCommonMoodThisWeek ? MOOD_MAP[mostCommonMoodThisWeek].color : 'inherit'}}>
              {mostCommonMoodThisWeek ? `${MOOD_MAP[mostCommonMoodThisWeek].emoji} ${t(mostCommonMoodThisWeek)}` : t('noEntriesThisWeek')}
            </p>
        </div>
        <div className="p-6 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl shadow-lg">
            <h3 className="text-lg font-bold text-primary-text-light dark:text-primary-text-dark mb-2">{t('monthlyOverview')}</h3>
            <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">{t('monthlyOverviewDescription')}</p>
        </div>
      </div>
      
      <MoodCalendar history={moodHistory} />

    </div>
  );
};

export default MoodHistoryPage;