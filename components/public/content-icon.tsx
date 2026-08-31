import {
  BookOpen,
  Briefcase,
  Cpu,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  HeartHandshake,
  Laptop,
  Lightbulb,
  Megaphone,
  Rocket,
  Target,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  userplus: UserPlus,
  'user-plus': UserPlus,
  handheart: HeartHandshake,
  'hand-heart': HeartHandshake,
  heart: Heart,
  hearthandshake: HeartHandshake,
  handshake: Handshake,
  megaphone: Megaphone,
  globe: Globe,
  graduationcap: GraduationCap,
  graduation: GraduationCap,
  briefcase: Briefcase,
  bookopen: BookOpen,
  book: BookOpen,
  laptop: Laptop,
  cpu: Cpu,
  rocket: Rocket,
  target: Target,
  lightbulb: Lightbulb,
};

function normalizeIconName(name?: string | null) {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function ContentIcon({
  name,
  className,
  fallback: Fallback = Users,
}: {
  name?: string | null;
  className?: string;
  fallback?: LucideIcon;
}) {
  const key = normalizeIconName(name);
  const Icon = ICONS[key] || ICONS[key.replace(/-/g, '')] || Fallback;
  return <Icon className={className} />;
}
