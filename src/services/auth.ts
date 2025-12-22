
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    updateProfile
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { dbService } from "./db";

export interface AuthState {
    user: User | null;
    loading: boolean;
}

export const authService = {
    // Observer
    onAuthStateChanged: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    },

    // Sign Up
    signUp: async (email: string, pass: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // Update display name
            await updateProfile(user, { displayName: name });

            // Create user profile in Firestore
            await dbService.createUserProfile(user);

            return user;
        } catch (error: any) {
            console.error("Error signing up:", error);
            throw new Error(error.message);
        }
    },

    // Sign In
    signIn: async (email: string, pass: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            return userCredential.user;
        } catch (error: any) {
            console.error("Error signing in:", error);
            throw new Error(error.message);
        }
    },

    // Sign Out
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error: any) {
            console.error("Error signing out:", error);
            throw new Error(error.message);
        }
    },

    // Get Current User
    getCurrentUser: () => {
        return auth.currentUser;
    }
};
