live link : https://safe-journey-hub.vercel.app/
# SafeTransit - Women's Safety & Journey Monitoring Hub

SafeTransit is a real-time web application designed to enhance personal safety during travel. It allows users to share their live location with trusted contacts, monitor their journey, and trigger instant SOS alerts in case of emergency.

![SafeTransit Dashboard](https://images.unsplash.com/photo-1518558997970-4dad12e75fdd?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

### 1. 🛡️ Real-Time Journey Monitoring
- **Live GPS Tracking:** Uses the browser's Geolocation API to track your exact position in real-time.
- **Interactive Map:** Visualizes your journey on a dynamic map (OpenStreetMap).
- **Status Updates:** automatically updates your safety status to Firestore (e.g., "En Route", "At Destination").

### 2. 🚨 Instant SOS System
- **One-Tap Alert:** Dedicated SOS button for immediate emergency activation.
- **Trusted Contact Notification:** Instantly triggers alerts to your added trusted contacts.
- **Email Integration:** Sends real-time emails to contacts with your exact location link (Google Maps) via EmailJS.

### 3. 👥 Trusted Contacts Management
- **Add/Manage Contacts:** Securely store contact details (Name, Phone, Email) of friends and family.
- **Privacy First:** Data is stored in a secured Firestore sub-collection, accessible only by you.

### 4. 🔒 Secure Infrastructure
- **Authentication:** Robust email/password signup and login via Firebase Authentication.
- **Database Security:** Strict Firestore Security Rules ensuring user data isolation (users can only access their own trip data).

---

## 🛠️ Technology Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Backend/DB:** Firebase (Authentication, Firestore)
- **Maps:** Leaflet / React-Leaflet (OpenStreetMap)
- **Services:** EmailJS (for email alerts)

---

## 🏃‍♂️ Local Setup & Installation

Follow these steps to run SafeTransit locally on your machine.

### Prerequisites
- Node.js (v16+)
- npm

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/mishraadarsh27/safe-journey-hub.git
    cd safe-journey-hub
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Firebase and EmailJS keys:
    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

    # EmailJS Configuration (Optional for SOS Emails)
    VITE_EMAILJS_SERVICE_ID=your_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_template_id
    VITE_EMAILJS_USER_ID=your_public_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will open at `http://localhost:8080`.

---

## 🚀 Deployment

The project is built with Vite and can be easily deployed to Vercel, Netlify, or Firebase Hosting.

**Build for Production:**
```bash
npm run build
```

---

## 📝 License

This project is open-source and available under the MIT License.

---

*Verified & Tested: 2025-12-23*
