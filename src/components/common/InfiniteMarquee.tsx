import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  Briefcase
} from 'lucide-react';

interface MarqueeItem {
  icon: React.ElementType;
  text: string;
  badge?: string;
}

interface InfiniteMarqueeProps {
  items?: MarqueeItem[];
  className?: string;
  speed?: 'normal' | 'slow';
}

const defaultItems: MarqueeItem[] = [
  { icon: Award, text: "UGC-DEB Approved Degrees", badge: "Accredited" },
  { icon: ShieldCheck, text: "NIOS & State Open Schooling", badge: "Recognized" },
  { icon: Building2, text: "50+ Enterprise Corporate Partners", badge: "Hiring" },
  { icon: GraduationCap, text: "NAAC A+ Accredited University Cohorts", badge: "Quality" },
  { icon: CheckCircle2, text: "100% Verified University Fee Schedules", badge: "Transparency" },
  { icon: Briefcase, text: "Fast-Track Corporate Candidate Placement", badge: "48h Shortlist" },
  { icon: Sparkles, text: "Personalized 1-on-1 Academic Advisory", badge: "Free Exploratory" },
];

export const InfiniteMarquee = ({
  items = defaultItems,
  className = '',
}: InfiniteMarqueeProps) => {
  return (
    <div className={`overflow-hidden py-4 border-y border-slate-100 bg-white/70 backdrop-blur-sm relative ${className}`}>
      {/* Left and Right blur gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-bgLight to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-bgLight to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center space-x-8">
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-soft-sm flex-shrink-0 select-none group hover:border-brand-blue/30 hover:bg-brand-blueLight/20 transition-all cursor-default"
            >
              <div className="w-6 h-6 rounded-lg bg-brand-blueLight text-brand-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-700 tracking-tight whitespace-nowrap">
                {item.text}
              </span>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold text-brand-blue bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-2xs">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
