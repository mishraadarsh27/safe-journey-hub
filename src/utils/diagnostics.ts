
import { authService } from "@/services/auth";
import { dbService, TripData } from "@/services/db";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const runDiagnostics = async () => {
    const report: string[] = [];
    const log = (msg: string) => {
        console.log(`[Diagnostic] ${msg}`);
        report.push(msg);
    };

    log("Starting System Diagnostics...");

    try {
        // 1. Auth Check
        log("1. Testing Authentication...");
        const testEmail = `test_${Date.now()}@example.com`;
        const testPass = "password123";
        let user;

        try {
            user = await authService.signUp(testEmail, testPass, "Test User");
            log("✅ Sign Up Successful: " + user.uid);
        } catch (e: any) {
            log("❌ Sign Up Failed: " + e.message);
            throw e;
        }

        // 2. DB Write Check (Contacts)
        log("2. Testing Firestore Write (Contacts)...");
        try {
            await dbService.addContact(user.uid, { name: "Mom", phone: "1234567890" });
            log("✅ Add Contact Successful");
        } catch (e: any) {
            log("❌ Add Contact Failed: " + e.message);
            throw e;
        }

        // 3. DB Read Check (Contacts)
        log("3. Testing Firestore Read (Contacts)...");
        try {
            const contacts = await dbService.getContacts(user.uid);
            if (contacts.length > 0) {
                log(`✅ Get Contacts Successful (Found ${contacts.length})`);
            } else {
                log("⚠️ Get Contacts returned empty (Unexpected)");
            }
        } catch (e: any) {
            log("❌ Get Contacts Failed: " + e.message);
            throw e;
        }

        // 4. Journey/Trip Flow
        log("4. Testing Trip Flow...");
        let tripId;
        try {
            const tripData: TripData = {
                userId: user.uid,
                destination: "Test Destination",
                startLocation: { lat: 12.9716, lng: 77.5946 },
                status: 'active'
            };
            tripId = await dbService.startTrip(tripData);
            log("✅ Start Trip Successful: " + tripId);

            // 4.1 Verify Trip Read
            const tripDoc = await getDoc(doc(db, "trips", tripId));
            if (tripDoc.exists() && tripDoc.data().userId === user.uid) {
                log("✅ Verify Trip Read Successful");
            } else {
                throw new Error("Could not read back the created trip");
            }
        } catch (e: any) {
            log("❌ Start Trip Failed: " + e.message);
            throw e;
        }

        // 5. Update Location
        try {
            await dbService.updateTripLocation(tripId, 12.9720, 77.5950);
            log("✅ Update Location Successful");
        } catch (e: any) {
            log("❌ Update Location Failed: " + e.message);
            // Non-critical, continue
        }

        // 6. SOS Information
        log("6. Testing SOS Trigger...");
        try {
            await dbService.triggerSOS(tripId, user.uid, { lat: 12.9720, lng: 77.5950 });
            log("✅ SOS Trigger Successful");
        } catch (e: any) {
            log("❌ SOS Trigger Failed: " + e.message);
            throw e;
        }

        // Cleanup (Optional - Logout)
        await authService.logout();
        log("✅ Logout Successful");
        log("--------------------------------");
        log("DIAGNOSTICS COMPLETE: SYSTEMS NOMINAL");

    } catch (error: any) {
        log("--------------------------------");
        log("❌ CRITICAL FAILURE: " + error.message);
    }

    return report.join("\n");
};
