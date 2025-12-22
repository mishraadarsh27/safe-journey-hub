
import {
    collection,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    serverTimestamp,
    GeoPoint,
    getDocs,
    query,
    where,
    Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Types
export interface UserProfile {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    lastLogin: any;
}

export interface TripData {
    userId: string;
    destination: string;
    startLocation: { lat: number; lng: number };
    status: 'active' | 'completed' | 'emergency';
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    relation?: string;
}

export const dbService = {
    // Users
    createUserProfile: async (user: any) => {
        if (!user.uid) throw new Error("Invalid user object");
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            userId: user.uid,
            name: user.displayName || "Unknown",
            email: user.email || "",
            lastLogin: serverTimestamp(),
        }, { merge: true });
    },

    getUserProfile: async (userId: string) => {
        // Placeholder for future need
    },

    // Contacts
    addContact: async (userId: string, contact: Omit<Contact, 'id'>) => {
        if (!userId) throw new Error("User ID required");
        if (!contact.name || !contact.phone) throw new Error("Invalid contact data");

        const contactsRef = collection(db, `users/${userId}/contacts`);
        const docRef = await addDoc(contactsRef, {
            ...contact,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    },

    getContacts: async (userId: string): Promise<Contact[]> => {
        if (!userId) return [];
        const contactsRef = collection(db, `users/${userId}/contacts`);
        const q = query(contactsRef);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Contact));
    },

    // Trips
    startTrip: async (tripData: TripData) => {
        if (!tripData.userId) throw new Error("User ID required for trip");

        const docRef = await addDoc(collection(db, "trips"), {
            ...tripData,
            startTime: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            currentLocation: new GeoPoint(tripData.startLocation.lat, tripData.startLocation.lng)
        });
        return docRef.id;
    },

    updateTripLocation: async (tripId: string, lat: number, lng: number) => {
        if (!tripId) return;
        const tripRef = doc(db, "trips", tripId);
        await updateDoc(tripRef, {
            currentLocation: new GeoPoint(lat, lng),
            lastUpdated: serverTimestamp()
        });
    },

    endTrip: async (tripId: string) => {
        if (!tripId) return;
        const tripRef = doc(db, "trips", tripId);
        await updateDoc(tripRef, {
            status: 'completed',
            endTime: serverTimestamp()
        });
    },

    // SOS
    triggerSOS: async (tripId: string, userId: string, location: { lat: number; lng: number }, contacts: Contact[] = []) => {
        if (!userId || !location) throw new Error("Missing critical SOS data");
        const batch = [];

        // 1. Mark trip as emergency (if trip exists)
        if (tripId) {
            const tripRef = doc(db, "trips", tripId);
            await updateDoc(tripRef, { status: 'emergency', lastUpdated: serverTimestamp() });
        }

        // 2. Create Alert
        await addDoc(collection(db, "sos_alerts"), {
            tripId: tripId || null,
            userId,
            location: new GeoPoint(location.lat, location.lng),
            timestamp: serverTimestamp(),
            triggerType: 'manual',
            notifiedContacts: contacts.map(c => ({ name: c.name, phone: c.phone }))
        });
    }
};
