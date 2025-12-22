import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, subtitle, delay = 0 }: FeatureCardProps) => {
  return (
    <div 
      className="group p-6 md:p-8 rounded-2xl bg-card border border-border/50 shadow-card card-interactive cursor-pointer opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Icon Container */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-5 transition-transform duration-200 group-hover:scale-110">
        <Icon className="w-7 h-7 text-accent-foreground" strokeWidth={1.5} />
      </div>

      {/* Text Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {subtitle}
      </p>

      {/* Subtle hover indicator */}
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span>Learn more</span>
        <svg 
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default FeatureCard;
