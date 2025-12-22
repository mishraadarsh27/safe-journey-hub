import { ShieldCheck, Video, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tips = [
    {
        icon: ShieldCheck,
        title: "Stay Aware",
        description: "Always be aware of your surroundings, especially in unfamiliar areas.",
    },
    {
        icon: Phone,
        title: "Keep Phone Charged",
        description: "Ensure your phone has enough battery before starting a long journey.",
    },
    {
        icon: Video,
        title: "Video Call",
        description: "If you feel unsafe, start a video call with a trusted friend.",
    },
];

const SafetyTipsSection = () => {
    return (
        <section id="safety-tips" className="w-full py-12 md:py-16 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-10 text-3xl font-bold">
                    <h2>Safety Tips</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {tips.map((tip, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <tip.icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{tip.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{tip.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SafetyTipsSection;
