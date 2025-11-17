import { Message, ChatSession } from '../types';
import { getCurrentUser } from './authService';

const SESSIONS_KEY_PREFIX = 'calmly_chat_sessions_';
const MESSAGES_KEY_PREFIX = 'calmly_chat_messages_';

const getUserEmail = (): string | null => {
    const user = getCurrentUser();
    return user ? user.email : null;
}

export const getChatSessions = (): ChatSession[] => {
    const email = getUserEmail();
    if (!email) return [];

    try {
        const sessionsJson = localStorage.getItem(`${SESSIONS_KEY_PREFIX}${email}`);
        if (!sessionsJson) return [];
        const sessions = JSON.parse(sessionsJson) as ChatSession[];
        // Sort by timestamp, newest first
        return sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
        console.error("Failed to parse chat sessions from localStorage", error);
        return [];
    }
};

export const saveChatSessions = (sessions: ChatSession[]): void => {
    const email = getUserEmail();
    if (!email) return;

    try {
        localStorage.setItem(`${SESSIONS_KEY_PREFIX}${email}`, JSON.stringify(sessions));
    } catch (error) {
        console.error("Failed to save chat sessions to localStorage", error);
    }
};


export const getMessages = (sessionId: string): Message[] => {
    const email = getUserEmail();
    if (!email) return [];

    try {
        const messagesJson = localStorage.getItem(`${MESSAGES_KEY_PREFIX}${email}_${sessionId}`);
        return messagesJson ? JSON.parse(messagesJson) : [];
    } catch (error) {
        console.error(`Failed to parse messages for session ${sessionId}`, error);
        return [];
    }
};


export const saveMessages = (sessionId: string, messages: Message[]): void => {
    const email = getUserEmail();
    if (!email) return;

    try {
        localStorage.setItem(`${MESSAGES_KEY_PREFIX}${email}_${sessionId}`, JSON.stringify(messages));
    } catch (error) {
        console.error(`Failed to save messages for session ${sessionId}`, error);
    }
};

export const createNewSession = (): ChatSession => {
    const newSession: ChatSession = {
        id: crypto.randomUUID(),
        title: 'New Chat',
        timestamp: new Date().toISOString()
    };
    
    const sessions = getChatSessions();
    saveChatSessions([newSession, ...sessions]);
    
    return newSession;
};

export const updateSessionTitle = (sessionId: string, newTitle: string): void => {
    const sessions = getChatSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
        sessions[sessionIndex].title = newTitle;
        saveChatSessions(sessions);
    }
};


export const deleteSession = (sessionId: string): void => {
    const email = getUserEmail();
    if (!email) return;

    // Delete messages for the session
    localStorage.removeItem(`${MESSAGES_KEY_PREFIX}${email}_${sessionId}`);

    // Remove the session from the list
    const sessions = getChatSessions();
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    saveChatSessions(updatedSessions);
};