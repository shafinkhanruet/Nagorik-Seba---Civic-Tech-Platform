import { LucideIcon } from 'lucide-react';

export type Language = 'bn' | 'en';
export type Theme = 'light' | 'dark';
export type Role = 'citizen' | 'moderator' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  role: Role;
  token: string;
  expiresAt: number;
}

export interface NavItem {
  id: string;
  labelBn: string;
  labelEn: string;
  path: string;
  icon: LucideIcon;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
}

export interface TranslationDictionary {
  [key: string]: {
    bn: string;
    en: string;
  };
}

// Notification Types
export type NotificationType = 'project' | 'district' | 'report' | 'hospital' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface WatchlistItem {
  id: string;
  type: NotificationType;
  name: string; // For display purposes
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushAlerts: boolean;
  projectUpdates: boolean;
  districtScores: boolean;
  reportStatus: boolean;
}

// RTI Types
export type RTIStatus = 'submitted' | 'acknowledged' | 'review' | 'responded' | 'closed';

export interface RTIRequest {
  id: string;
  department: string;
  subject: string;
  details: string;
  category: 'Budget' | 'Tender' | 'Policy' | 'Hospital' | 'Other';
  isPublic: boolean;
  status: RTIStatus;
  dateFiled: string; // ISO Date
  deadline: string; // ISO Date
  response?: string;
  applicantName: string; // Often anonymized in public view
  trackingId: string;
}