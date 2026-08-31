import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  href?: string;
}

export function DashboardCard({ label, value, icon: Icon, color, href }: DashboardCardProps) {
  const CardContent = (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group h-full">
      <div 
        className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" 
        style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${color})` }}
      />
      
      <div className="flex flex-col gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
