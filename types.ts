// Fix: Export View type to be shared across components.
export type View = 'intro' | 'tracker' | 'history' | 'chat' | 'games' | 'sos';

export interface Mood {
  name: 'Happy' | 'Okay' | 'Neutral' | 'Sad' | 'Angry' | 'Anxious' | 'Tired';
  emoji: string;
  color: string; // Hex color code
  glowColor: string; // Tailwind shadow class
}

export interface MoodEntry {
  id: string;
  moodName: Mood['name'];
  moodColor: string;
  timestamp: string; // ISO string
}

export interface EmergencyContact {
  name: string;
  countryCode: string;
  phone: string;
}

export enum Sender {
  User,
  AI,
}

// Interface for web search citations
export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  id: string; // For keying and TTS tracking
  text: string;
  sender: Sender;
  sources?: Source[]; // Optional sources for AI messages
  image?: {
    base64: string;
    mimeType: string;
  }
}

export interface User {
  name: string;
  email: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
}