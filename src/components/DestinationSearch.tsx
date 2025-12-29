
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { geocodingService, LocationResult } from "@/services/geocoding";
import { Loader2, MapPin } from "lucide-react";

interface DestinationSearchProps {
    onSelect: (location: LocationResult) => void;
    disabled?: boolean;
}

export const DestinationSearch = ({ onSelect, disabled }: DestinationSearchProps) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LocationResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 3) {
                setIsLoading(true);
                const locations = await geocodingService.searchLocation(query);
                setResults(locations);
                setIsLoading(false);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 800); // 800ms debounce to be nice to free API

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (location: LocationResult) => {
        setQuery(location.name.split(',')[0]); // Just keep the main name
        setIsOpen(false);
        onSelect(location);
    };

    return (
        <div className="relative z-50">
            <Input
                placeholder="Where are you going?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={disabled}
                className="w-full"
            />

            {isLoading && (
                <div className="absolute right-3 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
            )}

            {isOpen && results.length > 0 && (
                <Card className="absolute w-full mt-1 max-h-60 overflow-y-auto shadow-lg border-t-0 rounded-t-none">
                    <ul className="py-1">
                        {results.map((result, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-muted cursor-pointer text-sm flex items-center gap-2"
                                onClick={() => handleSelect(result)}
                            >
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="truncate">{result.name}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
};
