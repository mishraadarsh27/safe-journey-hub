import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, UserPlus, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dbService, Contact } from "@/services/db";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ManageContacts = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, `users/${user.uid}/contacts`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loaded: Contact[] = [];
            snapshot.forEach((doc) => {
                loaded.push({ id: doc.id, ...doc.data() } as Contact);
            });
            setContacts(loaded);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAdd = async () => {
        if (!newName || !newPhone) return;
        try {
            if (user) {
                await dbService.addContact(user.uid, { name: newName, phone: newPhone });
                setNewName("");
                setNewPhone("");
                toast({ title: "Contact Added", description: `${newName} is now a trusted contact.` });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Could not add contact", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">Emergency Contacts</h1>
                <p className="text-muted-foreground mb-8">
                    Add trusted people who should be notified when you trigger an SOS.
                </p>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Add New Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Name (e.g. Mom)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <Input
                            placeholder="Phone Number"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                        />
                        <Button onClick={handleAdd} className="w-full">Save Contact</Button>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Your Trusted Circle</h2>
                    {contacts.length === 0 && <p className="text-muted-foreground italic">No contacts added yet.</p>}

                    {contacts.map((contact) => (
                        <Card key={contact.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{contact.name}</p>
                                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageContacts;
