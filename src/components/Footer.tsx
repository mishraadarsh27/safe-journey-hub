import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 border-t border-border/50 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">SafeTransit</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © 2024 SafeTransit. Keeping you safe, always.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Privacy
            </span>
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Terms
            </span>
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Contact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
