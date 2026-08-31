import { Badge } from '@/components/ui/badge';

export type StatusType = 'live' | 'coming_soon' | 'under_development' | 'temporarily_unavailable' | 'draft' | 'archived' | 'published';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'live':
    case 'published':
      return <Badge className="bg-green-500 hover:bg-green-600 text-white">Live</Badge>;
    case 'coming_soon':
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Coming Soon</Badge>;
    case 'under_development':
      return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Under Development</Badge>;
    case 'temporarily_unavailable':
      return <Badge variant="destructive">Temporarily Unavailable</Badge>;
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    case 'archived':
      return <Badge variant="outline">Archived</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}
