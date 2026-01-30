import { LucideIcon } from 'lucide-react';

export type Language = 'bn' | 'en';
export type Theme = 'light' | 'dark';

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