
import emailjs from 'emailjs-com';
import { Contact } from './db';

// Initialize with your user ID (safely check for env presence)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_mock';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_mock';
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || 'user_mock';

export const emailService = {
    sendSOS: async (userName: string, location: { lat: number; lng: number }, contacts: Contact[]) => {
        if (!contacts.length) return;

        const mapLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
        const emails = contacts.map(c => c.email).filter(Boolean).join(','); // Assuming contact has email, if not, we can't send.

        // Detailed check
        if (!emails) {
            console.warn("No emails found for contacts");
            return;
        }

        const templateParams = {
            user_name: userName,
            location_link: mapLink,
            timestamp: new Date().toLocaleString(),
            to_email: emails, // Note: EmailJS free tier usually sends to ONE admin or requires loop. 
            // For MVP, we will try to send to the first contact or log mock if keys missing.
        };

        if (SERVICE_ID === 'service_mock') {
            console.log("Mocking Email Send:", templateParams);
            return;
        }

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
            console.log("SOS Email Sent Successfully");
        } catch (error) {
            console.error("Failed to send SOS Email:", error);
            // Don't block the UI flow
        }
    }
};
