import { User } from '../types';

export const getCurrentUser = (): User => {
    // In this simplified version, we return a static, anonymous user.
    // This avoids the need for a login system while still allowing
    // other services (like mood and chat history) to have a consistent user key.
    return {
        name: 'Friend',
        email: 'anonymous_user@calmly.app'
    };
};

// FIX: Adding mock implementations for login, signup, and verifyUser to resolve compilation errors in AuthPage.tsx.
// These functions are not actively used in the app's current flow.
export const login = (email: string, password: string): { success: boolean, user?: User, message?: string } => {
    console.warn("Login function is a mock. App uses a static user.");
    if (email && password) {
         const user = { name: 'Test User', email: email };
         return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials.' };
};

export const signup = (name: string, email: string, password: string): { success: boolean, verificationToken?: string, message: string } => {
    console.warn("Signup function is a mock. App uses a static user.");
    if (name && email && password) {
        return { success: true, verificationToken: 'mock-verification-token', message: 'Account created! Please check your email to verify your account.' };
    }
    return { success: false, message: 'An error occurred during signup.' };
};

export const verifyUser = (token: string): { success: boolean, message: string } => {
    console.warn("verifyUser function is a mock. App uses a static user.");
    if(token === 'mock-verification-token') {
        return { success: true, message: 'Email verified successfully! You can now log in.' };
    }
    return { success: false, message: 'Invalid verification token.'};
};
