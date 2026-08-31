import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  badge?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, centered = true, light, badge, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 flex flex-col', centered && 'items-center text-center', className)}>
      {badge && (
        <div
          className={cn(
            'inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide uppercase mb-4 border transition-colors',
            light
              ? 'border-white/20 bg-white/10 text-white backdrop-blur-md'
              : 'border-blue-200 bg-blue-50 text-blue-700'
          )}
        >
          {badge}
        </div>
      )}
      <h2 className={cn('text-3xl md:text-4xl font-bold tracking-tight mb-4', light ? 'text-white' : 'text-slate-900')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-lg max-w-2xl', light ? 'text-slate-300' : 'text-slate-600')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
