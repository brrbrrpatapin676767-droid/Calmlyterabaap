import { Mood } from './types';

export const MOODS: Mood[] = [
  { name: 'Happy', emoji: '😄', color: '#FFD700', glowColor: 'shadow-yellow-400/50' }, // Gold
  { name: 'Okay', emoji: '🙂', color: '#32CD32', glowColor: 'shadow-lime-400/50' },   // LimeGreen
  { name: 'Neutral', emoji: '😐', color: '#B0C4DE', glowColor: 'shadow-slate-500/50' }, // LightSteelBlue
  { name: 'Sad', emoji: '😔', color: '#1E90FF', glowColor: 'shadow-sky-400/50' },     // DodgerBlue
  { name: 'Angry', emoji: '😡', color: '#FF4500', glowColor: 'shadow-red-400/50' },     // OrangeRed
  { name: 'Anxious', emoji: '😰', color: '#9370DB', glowColor: 'shadow-purple-400/50' }, // MediumPurple
  { name: 'Tired', emoji: '😴', color: '#48D1CC', glowColor: 'shadow-teal-400/50' },   // MediumTurquoise
];

// Creates a lookup map for quick access to mood properties by name
export const MOOD_MAP: Record<Mood['name'], Mood> = MOODS.reduce((acc, mood) => {
    acc[mood.name] = mood;
    return acc;
}, {} as Record<Mood['name'], Mood>);