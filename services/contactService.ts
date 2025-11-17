
import { EmergencyContact } from '../types';
import { getCurrentUser } from './authService';

const CONTACT_KEY = 'calmly_emergency_contact';

// Helper to check if localStorage is available and working.
const isLocalStorageAvailable = (): boolean => {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};


export const getContact = (): EmergencyContact | null => {
  const user = getCurrentUser();
  if (!user || !isLocalStorageAvailable()) return null;

  try {
    const contactJson = localStorage.getItem(`${CONTACT_KEY}_${user.email}`);
    if (!contactJson) return null;
    return JSON.parse(contactJson);
  } catch (error) {
    console.error("Failed to parse emergency contact from localStorage", error);
    return null;
  }
};

export const saveContact = (contact: EmergencyContact): void => {
  const user = getCurrentUser();
  if (!user || !isLocalStorageAvailable()) {
      console.warn('User not logged in or localStorage is not available. Contact not saved.');
      return;
  }
  localStorage.setItem(`${CONTACT_KEY}_${user.email}`, JSON.stringify(contact));
};

export const deleteContact = (): void => {
  const user = getCurrentUser();
  if (!user || !isLocalStorageAvailable()) {
      console.warn('User not logged in or localStorage is not available.');
      return;
  }
  localStorage.removeItem(`${CONTACT_KEY}_${user.email}`);
};
