import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";

const Header = () => {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <header className="w-full py-4 px-4 md:px-6 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tracking-tight">
              SafeTransit
            </span>
            <span className="text-xs text-muted-foreground -mt-0.5">
              Your safety companion
            </span>
          </div>
        </div>

        {/* Navigation placeholder */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => window.location.href = "/#features"}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
          >
            Features
          </button>
          <button
            onClick={() => window.location.href = "/#safety-tips"}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
          >
            Safety Tips
          </button>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                {user.displayName}
              </span>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = "/contacts"}>
                Contacts
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={loginWithGoogle}>
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
