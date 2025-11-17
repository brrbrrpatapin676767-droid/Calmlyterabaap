import { getCurrentUser } from './authService';

const GRATITUDE_JOURNAL_KEY = 'calmly_gratitude_journal';

export const saveGratitudeEntry = (entry: string): void => {
    const user = getCurrentUser();
    if (!user) return;
    localStorage.setItem(`${GRATITUDE_JOURNAL_KEY}_${user.email}`, entry);
};

export const getLatestGratitudeEntry = (): string => {
    const user = getCurrentUser();
    if (!user) return '';
    return localStorage.getItem(`${GRATITUDE_JOURNAL_KEY}_${user.email}`) || '';
};
