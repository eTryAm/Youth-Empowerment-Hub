export type { 
  Platform, NewPlatform,
  Initiative, NewInitiative,
  Objective, NewObjective,
  Event, NewEvent,
  Announcement, NewAnnouncement,
  ImpactMetric, NewImpactMetric,
  Testimonial, NewTestimonial,
  Partner, NewPartner,
  GetInvolvedLink, NewGetInvolvedLink,
  ContactSubmission, NewContactSubmission,
  Media, NewMedia,
  SiteSetting,
  HomepageSection, NewHomepageSection,
  FeatureFlag,
  AuditLog, NewAuditLog,
  NavigationItem, NewNavigationItem,
  User, NewUser,
} from '@/lib/db/schema';

// Platform status type
export type PlatformStatus = 'live' | 'coming_soon' | 'under_development' | 'temporarily_unavailable' | 'draft' | 'archived';

// Content status type
export type ContentStatus = 'draft' | 'published' | 'archived';

// Contact status type
export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

// User role type
export type UserRole = 'super_admin' | 'content_admin' | 'viewer';

// Admin sidebar navigation item
export interface AdminNavItem {
  title: string;
  href: string;
  icon: string;
  permission?: string;
  children?: AdminNavItem[];
}

// Dashboard stat card
export interface DashboardStat {
  label: string;
  value: number | string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  href?: string;
}

// API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
