import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dbService, Contact, TripData } from "@/services/db";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, MapPin, Navigation, Phone, CheckCircle, Share2, Users, Play } from "lucide-react";
import LiveMap from "@/components/LiveMap";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { emailService } from "@/services/email";

const Dashboard = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [activeTripId, setActiveTripId] = useState<string | null>(null);
    const [isEmergency, setIsEmergency] = useState(false);

    // Real-time location tracking
    const { location: trackedLocation, error: trackerError } = useLocationTracker(activeTripId);

    // Use tracked location if available, else local state
    const displayLocation = trackedLocation || null;
    const gpsStatusError = trackerError || null;

    const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);

    // Fetch contacts on load
    useEffect(() => {
        if (!user) return;
        const fetchContacts = async () => {
            const q = query(collection(db, `users/${user.uid}/contacts`));
            const snapshot = await getDocs(q);
            const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
            setEmergencyContacts(loaded);
        };
        fetchContacts();
    }, [user]);



    // Clean up old GPS effect logic as it's now in the hook, but we need initial location for Start Trip
    // We will let the hook handle updates.

    const handleStartTrip = async () => {
        if (!user || activeTripId) return;

        // Get initial location
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                const tripData: TripData = {
                    userId: user.uid,
                    destination: "Not Specified", // Could add input for this
                    startLocation: { lat: latitude, lng: longitude },
                    status: 'active'
                };
                const id = await dbService.startTrip(tripData);
                setActiveTripId(id);
                toast({
                    title: "Journey Started",
                    description: "Your location is now being monitored.",
                });
            } catch (error) {
                console.error(error);
                toast({ title: "Error", description: "Failed to start trip. Check connection.", variant: "destructive" });
            }
        }, (err) => {
            toast({ title: "GPS Error", description: "Location required to start.", variant: "destructive" });
        });
    };

    const handleShare = () => {
        // Mock share link
        const link = `https://safetransit.app/track/mock-trip-id`;
        navigator.clipboard.writeText(link);
        toast({
            title: "Link Copied!",
            description: "Share this link with friends/family to track you.",
        });
    };

    const handleSOS = async () => {
        if (!user) return;
        try {
            setIsEmergency(true);
            // Use current location or default
            const location = displayLocation
                ? { lat: displayLocation[0], lng: displayLocation[1] }
                : { lat: 0, lng: 0 };

            await dbService.triggerSOS("current-trip-id", user.uid, location, emergencyContacts);

            toast({
                title: "SOS ACTIVATED",
                description: `Alert sent to ${emergencyContacts.length} trusted contacts!`,
                variant: "destructive",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleEndTrip = async () => {
        try {
            // await dbService.endTrip("current-trip-id");
            toast({
                title: "Journey Completed",
                description: "You have arrived safely.",
            });
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Please log in to view your dashboard.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="container mx-auto max-w-4xl space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Active Journey</h1>
                        <p className="text-muted-foreground">Monitoring your safety</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate("/")}>
                            Back Home
                        </Button>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Navigation className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-semibold text-lg">{isEmergency ? "EMERGENCY" : "En Route"}</p>
                        </div>
                    </Card>

                    <Card className="p-4 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Destination</p>
                            <p className="font-semibold text-lg">Central Plaza</p> {/* Dynamic in real app */}
                        </div>
                    </Card>

                    <Card className="p-4 flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Safety Check</p>
                            <p className="font-semibold text-lg text-green-600 animate-pulse">Live</p>
                        </div>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Map Area */}
                    {/* Map Area */}
                    <Card className="lg:col-span-2 min-h-[400px] bg-muted/30 relative overflow-hidden rounded-xl border-0 shadow-sm">
                        {displayLocation ? (
                            <LiveMap position={displayLocation} />
                        ) : (
                            <div className="flex items-center justify-center h-full p-6 text-center">
                                {gpsStatusError ? (
                                    <div className="flex flex-col items-center max-w-sm">
                                        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                                        <h3 className="text-lg font-semibold text-destructive mb-2">Location Error</h3>
                                        <p className="text-muted-foreground mb-4">{gpsStatusError}</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => window.location.reload()}
                                        >
                                            Retry
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                        <p className="text-muted-foreground font-medium">Acquiring GPS Signal...</p>
                                        <p className="text-xs text-muted-foreground mt-2">Please allow location access if prompted.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Controls */}
                    <div className="space-y-4">
                        <Card className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg">Emergency Controls</h3>

                            <Button
                                variant="destructive"
                                size="lg"
                                className="w-full h-24 text-xl animate-pulse shadow-red-500/20 shadow-lg hover:shadow-red-500/40 transition-all"
                                onClick={handleSOS}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <AlertTriangle className="w-8 h-8" />
                                    <span>SOS ALERT</span>
                                </div>
                            </Button>

                            <Button variant="outline" className="w-full" onClick={handleShare}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Live Location
                            </Button>

                            <div className="text-xs text-center text-muted-foreground">
                                Pressing this will instantly notify {emergencyContacts.length > 0 ? `${emergencyContacts.length} contacts` : "authorities"} with your live location.
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <Button variant="secondary" className="w-full" onClick={() => window.open('tel:911')}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Emergency Services
                                </Button>
                                <Button variant="ghost" className="w-full text-xs h-8" onClick={() => window.location.href = "/contacts"}>
                                    <Users className="w-3 h-3 mr-2" />
                                    Manage Contacts ({emergencyContacts.length})
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            {!activeTripId ? (
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={handleStartTrip}
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Journey
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleEndTrip}
                                >
                                    End Journey
                                </Button>
                            )}
                        </Card>
                    </div>

                </div>

                {/* Debug Info (Visible for troubleshooting) */}
                <div className="mt-8 p-4 bg-black/5 rounded-lg text-xs font-mono text-muted-foreground">
                    <p className="font-bold mb-2">Diagnostic Info:</p>
                    <p>GPS Status: {gpsStatusError ? "Error" : displayLocation ? "Active" : "Searching..."}</p>
                    {gpsStatusError && <p className="text-destructive">Error Details: {gpsStatusError}</p>}
                    <p>Latitude: {displayLocation?.[0] || 'N/A'}</p>
                    <p>Longitude: {displayLocation?.[1] || 'N/A'}</p>
                    <p>User ID: {user?.uid || 'Not Logged In'}</p>
                    <p>Map Service: OpenStreetMap (Leaflet)</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
