import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "leaflet/dist/leaflet.css"; // Global Leaflet styles
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "@/components/ui/toaster"; // Assuming standard shadcn path, if not I will check file list.

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <App />
        <Toaster />
    </AuthProvider>
);

// @ts-ignore
import { runDiagnostics } from "@/utils/diagnostics";
// @ts-ignore
window.runDiagnostics = runDiagnostics;
