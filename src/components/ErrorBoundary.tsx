import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-gray-600 mb-6">
                            The application encountered an unexpected error.
                        </p>

                        <div className="bg-red-50 p-4 rounded-lg mb-6 text-left overflow-auto max-h-40">
                            <p className="font-mono text-xs text-red-700 break-words">
                                {this.state.error?.message}
                            </p>
                        </div>

                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            Reload Application
                        </Button>

                        <Button
                            variant="link"
                            onClick={() => window.location.href = "/"}
                            className="mt-2"
                        >
                            Return Home
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
