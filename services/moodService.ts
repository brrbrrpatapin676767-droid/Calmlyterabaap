import { MoodEntry, Mood } from '../types';
import { getCurrentUser } from './authService';

const MOOD_HISTORY_KEY = 'calmly_mood_history';

export const getMoodHistory = (): MoodEntry[] => {
  const user = getCurrentUser();
  if (!user) return [];

  try {
    const historyJson = localStorage.getItem(`${MOOD_HISTORY_KEY}_${user.email}`);
    if (!historyJson) return [];
    
    const history = JSON.parse(historyJson);
    // Ensure data is sorted by date, newest first
    return history.sort((a: MoodEntry, b: MoodEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Failed to parse mood history from localStorage", error);
    return [];
  }
};

export const saveMoodEntry = (mood: Mood): MoodEntry | undefined => {
  const user = getCurrentUser();
  if (!user) return undefined;

  const history = getMoodHistory();
  const newEntry: MoodEntry = {
    id: crypto.randomUUID(),
    moodName: mood.name,
    moodColor: mood.color,
    timestamp: new Date().toISOString(),
  };
  
  // Keep history to a reasonable size, e.g., 365 entries
  const updatedHistory = [newEntry, ...history].slice(0, 365);
  
  localStorage.setItem(`${MOOD_HISTORY_KEY}_${user.email}`, JSON.stringify(updatedHistory));
  return newEntry;
};
